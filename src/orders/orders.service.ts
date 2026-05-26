import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Validate products and calculate total
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, available: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products are unavailable');
    }

    const total = dto.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + product!.price * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        paymentMethod: dto.paymentMethod,
        paymentStatus: 'UNPAID', // add this
        address: dto.address,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products.find((p) => p.id === item.productId)!.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Auto-confirm COD orders
    if (dto.paymentMethod === 'CASH_ON_DELIVERY') {
      return this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'CONFIRMED' },
        include: { items: { include: { product: true } } },
      });
    }

    return order;
  }

  findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (userId && order.userId !== userId)
      throw new NotFoundException('Order not found');
    return order;
  }

  // Admin: get all orders
  findAll(status?: string) {
    return this.prisma.order.findMany({
      where: status ? { status: status as OrderStatus } : {},
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin: update order status
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status as OrderStatus },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // Admin: dashboard stats
  async getStats() {
  const [totalOrders, totalRevenue, pendingOrders, totalUsers, totalProducts, paidOrders] =
    await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count({ where: { paymentStatus: 'PAID' } }),
    ]);

  const recentOrders = await this.prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const ordersByStatus = await this.prisma.order.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    pendingOrders,
    totalUsers,
    totalProducts,
    paidOrders,
    ordersByStatus,
    recentOrders,
  };
}
}
