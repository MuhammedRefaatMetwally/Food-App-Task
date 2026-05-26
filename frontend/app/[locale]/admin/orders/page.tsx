'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/use-orders';
import { OrderStatus } from '@/types';
import { toast } from 'sonner';

const ALL_STATUSES: OrderStatus[] = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const { data: orders, isLoading } = useAdminOrders(filterStatus === 'ALL' ? undefined : filterStatus);
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>  {/* ✅ non-empty sentinel */}
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {orders?.map((order) => (
            <Card key={order.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-mono font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{order.user?.name} · {order.user?.email}</p>
                  <p className="text-sm">
                    {order.items.length} items ·{' '}
                    <span className="font-semibold text-orange-500">${order.total.toFixed(2)}</span>
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
                <Select
                  value={order.status}
                  onValueChange={(v) => handleStatusChange(order.id, v)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}