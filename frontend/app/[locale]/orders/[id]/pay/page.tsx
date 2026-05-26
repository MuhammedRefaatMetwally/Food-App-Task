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
import { CheckCircle, CreditCard, ShieldCheck, Lock } from 'lucide-react';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// ─── Stripe Elements appearance — wired to your CSS variable palette ──────────
//
// Stripe's iframe only accepts hex / rgb() / hsl() — NOT oklch().
// We resolve each CSS var to its computed value, then convert to rgb via a
// hidden <div> + getComputedStyle so the browser does the colour-space math.

function resolveVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** Convert any CSS colour (including oklch) to an rgb() string Stripe accepts. */
function toRgb(cssColor: string): string {
  if (typeof window === 'undefined') return '#000';
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;width:0;height:0;color:${cssColor}`;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color; // always returns rgb(…) or rgba(…)
  document.body.removeChild(el);
  return rgb || '#000';
}

function buildStripeAppearance() {
  const isDark = document.documentElement.classList.contains('dark');

  // Resolve tokens → rgb (Stripe-safe)
  const bg         = toRgb(resolveVar('--card'));
  const inputBg    = toRgb(resolveVar('--muted'));
  const text        = toRgb(resolveVar('--card-foreground'));
  const primary     = toRgb(resolveVar('--primary'));
  const primaryFg   = toRgb(resolveVar('--primary-foreground'));
  const border      = toRgb(resolveVar('--border'));
  const mutedFg     = toRgb(resolveVar('--muted-foreground'));
  const danger      = toRgb(resolveVar('--destructive'));
  const accent      = toRgb(resolveVar('--accent'));
  const accentFg    = toRgb(resolveVar('--accent-foreground'));

  // Slightly lighter/darker input bg for selected tab
  const tabSelectedBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
  const tabBorder     = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';
  const inputBorder   = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)';
  const inputFocus    = primary;

  return {
    theme: 'flat' as const,          // "flat" gives us full control vs "stripe"
    variables: {
      // Core palette
      colorPrimary:            primary,
      colorBackground:         bg,
      colorText:               text,
      colorDanger:             danger,
      colorTextPlaceholder:    mutedFg,
      colorTextSecondary:      mutedFg,

      // Inputs
      colorInputBackground:    inputBg,
      colorInputBorder:        inputBorder,
      colorInputText:          text,
      colorInputPlaceholder:   mutedFg,

      // Typography
      fontFamily:              "'Plus Jakarta Sans', sans-serif",
      fontSizeBase:            '14px',
      fontWeightNormal:        '400',
      fontWeightMedium:        '500',
      fontWeightBold:          '600',

      // Spacing & radius — match your --radius token (0.75rem)
      borderRadius:            '10px',
      spacingUnit:             '4px',
      spacingGridRow:          '20px',

      // Tab colours
      colorTabSelectedBackground: tabSelectedBg,
      colorTabSelectedText:       text,
      colorTabBorder:             tabBorder,
      colorTabText:               mutedFg,
      colorTabIconSelected:       primary,
      colorTabIconHover:          text,
      colorTabIconTab:            mutedFg,
    },
    rules: {
      // ── Overall form wrapper ──────────────────────────────────────────────
      '.Input': {
        backgroundColor: inputBg,
        border:          `1px solid ${inputBorder}`,
        borderRadius:    '10px',
        color:           text,
        fontSize:        '14px',
        padding:         '12px 14px',
        transition:      'border-color 0.15s, box-shadow 0.15s',
      },
      '.Input:focus': {
        border:    `1.5px solid ${inputFocus}`,
        boxShadow: `0 0 0 3px ${isDark ? 'rgba(232,120,40,0.18)' : 'rgba(232,120,40,0.12)'}`,
        outline:   'none',
      },
      '.Input::placeholder': {
        color: mutedFg,
      },
      '.Input--invalid': {
        border:    `1.5px solid ${danger}`,
        boxShadow: 'none',
      },

      // ── Labels ──────────────────────────────────────────────────────────
      '.Label': {
        color:        mutedFg,
        fontSize:     '12px',
        fontWeight:   '500',
        marginBottom: '6px',
        letterSpacing: '0.01em',
      },

      // ── Error text ───────────────────────────────────────────────────────
      '.Error': {
        color:    danger,
        fontSize: '12px',
      },

      // ── Tabs (Card / Apple Pay / etc.) ───────────────────────────────────
      '.Tab': {
        backgroundColor: 'transparent',
        border:          `1px solid ${tabBorder}`,
        borderRadius:    '10px',
        color:           mutedFg,
        padding:         '10px 16px',
        transition:      'all 0.15s',
      },
      '.Tab:hover': {
        backgroundColor: tabSelectedBg,
        color:           text,
        border:          `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'}`,
      },
      '.Tab--selected': {
        backgroundColor: tabSelectedBg,
        border:          `1.5px solid ${primary}`,
        color:           text,
        boxShadow:       `0 0 0 2px ${isDark ? 'rgba(232,120,40,0.20)' : 'rgba(232,120,40,0.15)'}`,
      },
      '.Tab--selected:focus': {
        boxShadow: `0 0 0 3px ${isDark ? 'rgba(232,120,40,0.25)' : 'rgba(232,120,40,0.18)'}`,
      },
      '.TabLabel': {
        fontWeight: '500',
        fontSize:   '13px',
      },
      '.TabIcon': {
        fill: mutedFg,
      },
      '.TabIcon--selected': {
        fill: primary,
      },

      // ── Link / "Secure fast checkout" banner ─────────────────────────────
      '.Block': {
        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        border:          `1px solid ${tabBorder}`,
        borderRadius:    '10px',
      },

      // ── Select (Country dropdown) ────────────────────────────────────────
      '.Select': {
        backgroundColor: inputBg,
        border:          `1px solid ${inputBorder}`,
        borderRadius:    '10px',
        color:           text,
        fontSize:        '14px',
      },
      '.Select:focus': {
        border:    `1.5px solid ${inputFocus}`,
        boxShadow: `0 0 0 3px ${isDark ? 'rgba(232,120,40,0.18)' : 'rgba(232,120,40,0.12)'}`,
      },
    },
  };
}

// ─── CheckoutForm ─────────────────────────────────────────────────────────────
function CheckoutForm({
  orderId,
  paymentIntentId,
  amount,
}: {
  orderId: string;
  paymentIntentId: string;
  amount: number;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const router   = useRouter();
  const locale   = useLocale();

  const [loading,      setLoading]      = useState(false);
  const [succeeded,    setSucceeded]    = useState(false);
  const [elementReady, setElementReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !elementReady) return;

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message || 'Validation failed');
      setLoading(false);
      return;
    }

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

  // ── Success screen ──────────────────────────────────────────────────────────
  if (succeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center page-enter">
        <div className="relative flex items-center justify-center">
          {/* ping uses --primary tint */}
          <span
            className="absolute inline-flex h-20 w-20 animate-ping rounded-full opacity-30"
            style={{ background: 'var(--primary)' }}
          />
          <div
            className="relative flex items-center justify-center h-20 w-20 rounded-full ring-4"
            style={{
              background:   'color-mix(in oklch, var(--primary) 12%, transparent)',
              ringColor:    'color-mix(in oklch, var(--primary) 30%, transparent)',
              borderColor:  'color-mix(in oklch, var(--primary) 30%, transparent)',
            }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: 'var(--primary)' }} />
          </div>
        </div>

        <div className="space-y-1">
          <h2
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
          >
            Payment Successful!
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Redirecting you to your orders…
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{
            background:  'color-mix(in oklch, var(--primary) 12%, transparent)',
            color:       'var(--primary)',
            border:      '1px solid color-mix(in oklch, var(--primary) 25%, transparent)',
          }}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          ${amount.toFixed(2)} charged
        </div>
      </div>
    );
  }

  // ── Payment form ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe element — hidden until ready to avoid layout flash */}
      <div
        className="transition-opacity duration-300"
        style={{ opacity: elementReady ? 1 : 0, position: elementReady ? 'static' : 'absolute' }}
      >
        <PaymentElement
          onReady={() => setElementReady(true)}
          options={{ layout: 'tabs' }}
        />
      </div>

      {/* Skeleton placeholders while Stripe loads */}
      {!elementReady && (
        <div className="space-y-3">
          <div className="shimmer h-11 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="shimmer h-11" />
            <div className="shimmer h-11" />
          </div>
          <div className="shimmer h-11 w-full" />
        </div>
      )}

      {/* Trust badges */}
      {elementReady && (
        <div className="flex items-center justify-center gap-4 pt-1">
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Lock className="h-3 w-3" />
            SSL Encrypted
          </span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <ShieldCheck className="h-3 w-3" />
            Powered by Stripe
          </span>
        </div>
      )}

      {/* Pay button — uses --primary / --primary-foreground */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 glow"
        style={{
          background:   'var(--primary)',
          color:        'var(--primary-foreground)',
          borderRadius: 'var(--radius-xl)',
        }}
        disabled={!stripe || !elementReady || loading}
      >
        <CreditCard className="h-5 w-5 shrink-0" />
        {!elementReady
          ? 'Loading payment…'
          : loading
          ? 'Processing…'
          : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

// ─── Skeleton page loader ─────────────────────────────────────────────────────
function PayPageSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-4">
      <div className="shimmer h-7 w-36 mx-auto" />
      <div className="shimmer h-[340px] w-full" style={{ borderRadius: 'var(--radius-2xl)' }} />
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function PayPageError({ message }: { message: string }) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3 page-enter">
      <div
        className="mx-auto flex items-center justify-center h-14 w-14"
        style={{
          background:   'color-mix(in oklch, var(--destructive) 12%, transparent)',
          borderRadius: 'var(--radius-xl)',
          border:       '1px solid color-mix(in oklch, var(--destructive) 25%, transparent)',
        }}
      >
        <CreditCard className="h-7 w-7" style={{ color: 'var(--destructive)' }} />
      </div>
      <p
        className="font-semibold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)' }}
      >
        Payment Unavailable
      </p>
      <p className="text-sm" style={{ color: 'var(--destructive)' }}>{message}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [clientSecret,    setClientSecret]    = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [amount,          setAmount]          = useState<number>(0);
  const [error,           setError]           = useState<string | null>(null);
  const [appearance,      setAppearance]      = useState<ReturnType<typeof buildStripeAppearance>>();

  useEffect(() => {
    // Build Stripe appearance after mount so CSS vars are resolved
    setAppearance(buildStripeAppearance());

    api
      .post('/payment/create-intent', { orderId: id })
      .then(({ data }) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
        setAmount(data.amount);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to initialize payment');
      });
  }, [id]);

  if (!stripeKey)   return <PayPageError message="Stripe publishable key missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local" />;
  if (error)        return <PayPageError message={error} />;
  if (!clientSecret || !appearance) return <PayPageSkeleton />;

  return (
    <div
      className="min-h-screen mesh-bg transition-colors duration-300"
      style={{ paddingBlock: '2.5rem' }}
    >
      <div className="max-w-md mx-auto px-4 page-enter">
        {/* ── Card ── */}
        <Card
          className="glass overflow-hidden"
          style={{ borderRadius: 'var(--radius-2xl)' }}
        >
          {/* ── Header ── */}
          <CardHeader
            className="pb-5 pt-7 text-center space-y-3"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {/* Icon badge */}
            <div className="flex justify-center">
              <div
                className="flex items-center justify-center h-14 w-14"
                style={{
                  background:   'color-mix(in oklch, var(--primary) 12%, transparent)',
                  borderRadius: 'var(--radius-xl)',
                  border:       '1px solid color-mix(in oklch, var(--primary) 28%, transparent)',
                }}
              >
                <CreditCard className="h-7 w-7" style={{ color: 'var(--primary)' }} />
              </div>
            </div>

            <div className="space-y-0.5">
              <CardTitle
                className="text-xl font-bold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color:      'var(--card-foreground)',
                }}
              >
                Complete Payment
              </CardTitle>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Order #{id.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* Amount pill */}
            <div
              className="inline-flex items-baseline gap-1 px-5 py-2"
              style={{
                background:   'color-mix(in oklch, var(--primary) 10%, transparent)',
                borderRadius: 'var(--radius-xl)',
                border:       '1px solid color-mix(in oklch, var(--primary) 22%, transparent)',
              }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: 'color-mix(in oklch, var(--primary) 70%, var(--foreground))' }}
              >
                $
              </span>
              <span
                className="text-3xl font-extrabold tracking-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color:      'var(--primary)',
                }}
              >
                {amount.toFixed(2)}
              </span>
            </div>
          </CardHeader>

          {/* ── Form ── */}
          <CardContent className="px-6 pt-6 pb-8">
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance }}
            >
              <CheckoutForm
                orderId={id}
                paymentIntentId={paymentIntentId}
                amount={amount}
              />
            </Elements>
          </CardContent>
        </Card>

        {/* Footer */}
        <p
          className="mt-4 text-center text-xs"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Your payment info is encrypted and never stored on our servers.
        </p>
      </div>
    </div>
  );
}