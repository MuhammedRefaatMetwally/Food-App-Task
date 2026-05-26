'use client';

import { DollarSign, ShoppingBag, Clock, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { useAdminStats } from '@/hooks/use-orders';

function StatCard({ title, value, icon: Icon, gradient, delay = 0 }: {
  title: string;
  value: string | number;
  icon: any;
  gradient: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="border border-border/50 bg-card hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <p className="text-3xl font-bold tracking-tight">{value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, Admin</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingBag}
          gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          delay={0}
        />
        <StatCard
          title="Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(2)}`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-green-400 to-green-600"
          delay={0.07}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingOrders ?? 0}
          icon={Clock}
          gradient="bg-gradient-to-br from-orange-400 to-orange-600"
          delay={0.14}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          gradient="bg-gradient-to-br from-purple-400 to-purple-600"
          delay={0.21}
        />
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <Card className="border border-border/50 bg-card">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {stats?.recentOrders?.map((order: any, i: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between px-6 py-3.5 border-b border-border/40 last:border-0 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="font-mono text-sm font-semibold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.user?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-orange-500">
                    ${order.total?.toFixed(2)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}