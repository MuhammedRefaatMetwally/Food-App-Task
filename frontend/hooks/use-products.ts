import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product, Category } from '@/types';

export const productKeys = {
  all: ['products'] as const,
  list: (categoryId?: string) => [...productKeys.all, { categoryId }] as const,
  detail: (id: string) => [...productKeys.all, id] as const,
  categories: ['categories'] as const,
};

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: productKeys.list(categoryId),
    queryFn: async () => {
      const params = categoryId ? { categoryId } : {};
      const { data } = await api.get<Product[]>('/products', { params });
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/products/categories');
      return data;
    },
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: [...productKeys.all, 'admin'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/products/admin/all');
      return data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => api.post('/products', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Product> & { id: string }) =>
      api.put(`/products/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}