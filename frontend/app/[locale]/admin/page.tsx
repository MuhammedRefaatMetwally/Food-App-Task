'use client';

import { DollarSign, ShoppingBag, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { useAdminStats } from '@/hooks/use-orders';

function StatCard({ title, value, icon: Icon, color }: {
  title: string; value: string | number; icon: any; color: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders"   value={stats?.totalOrders ?? 0}           icon={ShoppingBag}  color="bg-blue-500" />
        <StatCard title="Revenue"        value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Pending"        value={stats?.pendingOrders ?? 0}          icon={Clock}        color="bg-orange-500" />
        <StatCard title="Total Users"    value={stats?.totalUsers ?? 0}             icon={Users}        color="bg-purple-500" />
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-mono text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{order.user?.name}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}