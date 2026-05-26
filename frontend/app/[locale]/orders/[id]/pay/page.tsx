'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { CheckCircle, CreditCard } from 'lucide-react';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// ✅ Accept paymentIntentId as prop — don't rely on Stripe response
function CheckoutForm({
  orderId,
  paymentIntentId,
}: {
  orderId: string;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [elementReady, setElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !elementReady) return;

    setLoading(true);

    // Step 1: validate fields
    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message || 'Validation failed');
      setLoading(false);
      return;
    }

    // Step 2: confirm with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message || 'Payment failed');
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Step 3: tell our backend — use the known paymentIntentId
      // ✅ Use paymentIntentId prop as fallback in case paymentIntent.id differs
      const intentId = paymentIntent.id || paymentIntentId;
      try {
        await api.post('/payment/confirm', { paymentIntentId: intentId });
        setSucceeded(true);
        toast.success('Payment successful! 🎉');
        setTimeout(() => router.push(`/${locale}/orders`), 2000);
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Failed to update order';
        toast.error(msg);
      }
    }

    setLoading(false);
  };

  if (succeeded) {
    return (
      <div className="text-center py-10 space-y-3">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold">Payment Successful!</h2>
        <p className="text-muted-foreground">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement onReady={() => setElementReady(true)} />

      {!elementReady && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-base gap-2"
        disabled={!stripe || !elementReady || loading}
      >
        <CreditCard className="h-5 w-5" />
        {!elementReady ? 'Loading...' : loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
}

export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>(''); // ✅ store it
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .post('/payment/create-intent', { orderId: id })
      .then(({ data }) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId); // ✅ save it here
        setAmount(data.amount);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to initialize payment');
      });
  }, [id]);

  if (!stripeKey) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-medium">
          Stripe publishable key missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-orange-500 p-3 rounded-full">
              <CreditCard className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle>Complete Payment</CardTitle>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            ${amount.toFixed(2)}
          </p>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: { colorPrimary: '#f97316' },
              },
            }}
          >
            {/* ✅ pass paymentIntentId down */}
            <CheckoutForm orderId={id} paymentIntentId={paymentIntentId} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}