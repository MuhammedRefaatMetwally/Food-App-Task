'use client';

import { use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const statusSteps = [
  'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED',
] as const;

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('orders');
  const locale = useLocale();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/my-orders/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) return null;

  const currentStep = statusSteps.indexOf(order.status as any);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-muted-foreground text-sm">
          {new Date(order.createdAt).toLocaleDateString(locale, {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>

      {/* Status tracker */}
      {order.status !== 'CANCELLED' && (
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Order Tracking</CardTitle></CardHeader>
          <CardContent>
            <div className="relative flex justify-between">
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-orange-500 z-0 transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1))) * 100}%` }}
              />
              {statusSteps.map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
                    ${i <= currentStep
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs text-center max-w-[60px] leading-tight ${i <= currentStep ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                    {step.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order items */}
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">{t('items')}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">x{item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>{t('total')}</span>
            <span className="text-orange-500">${order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Address</span>
            <span className="font-medium">{order.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('paymentMethod')}</span>
            <Badge variant="outline">
              {order.paymentMethod === 'CASH_ON_DELIVERY' ? '💵 Cash on Delivery' : '💳 Online'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <Badge variant="outline" className={order.paymentStatus === 'PAID' ? 'text-green-700 border-green-300' : 'text-yellow-700 border-yellow-300'}>
              {order.paymentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}