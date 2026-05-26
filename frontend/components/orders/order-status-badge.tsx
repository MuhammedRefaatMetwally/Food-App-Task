import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:          { label: 'Pending',          className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  CONFIRMED:        { label: 'Confirmed',         className: 'bg-blue-100 text-blue-800 border-blue-200' },
  PREPARING:        { label: 'Preparing',         className: 'bg-purple-100 text-purple-800 border-purple-200' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery',  className: 'bg-orange-100 text-orange-800 border-orange-200' },
  DELIVERED:        { label: 'Delivered',         className: 'bg-green-100 text-green-800 border-green-200' },
  CANCELLED:        { label: 'Cancelled',         className: 'bg-red-100 text-red-800 border-red-200' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}