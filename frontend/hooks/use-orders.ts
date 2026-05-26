import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Order } from '@/types';

export const orderKeys = {
  mine: ['my-orders'] as const,
  admin: ['admin-orders'] as const,
  stats: ['admin-stats'] as const,
};

export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.mine,
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders/my-orders');
      return data;
    },
  });
}

export function useAdminOrders(status?: string) {
  return useQuery({
    queryKey: [...orderKeys.admin, status],
    queryFn: async () => {
      const params = status ? { status } : {};
      const { data } = await api.get<Order[]>('/orders/admin/all', { params });
      return data;
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: orderKeys.stats,
    queryFn: async () => {
      const { data } = await api.get('/orders/admin/stats');
      return data;
    },
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      items: { productId: string; quantity: number }[];
      paymentMethod: string;
      address: string;
    }) => api.post<Order>('/orders', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.mine }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/orders/admin/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.admin });
      qc.invalidateQueries({ queryKey: orderKeys.stats });
    },
  });
}