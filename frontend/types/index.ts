export type Role = 'CUSTOMER' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CASH_ON_DELIVERY' | 'ONLINE';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  available: boolean;
  categoryId: string;
  category: Category;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: { name: string; email: string };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  address: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  role: Role;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalUsers: number;
  totalProducts: number;
  paidOrders: number;
  recentOrders: Order[];
  ordersByStatus: { status: OrderStatus; _count: { status: number } }[];
}