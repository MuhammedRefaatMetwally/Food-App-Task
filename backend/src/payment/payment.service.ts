import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.getOrThrow<string>('STRIPE_SECRET_KEY'));
  }

  async createPaymentIntent(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new BadRequestException('Order not found');
    if (order.userId !== userId) throw new BadRequestException('Unauthorized');
    if (order.paymentMethod !== 'ONLINE') {
      throw new BadRequestException('This order uses cash on delivery');
    }
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('Order already paid');
    }

    const amountInCents = Math.round(order.total * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency: this.config.get<string>('STRIPE_CURRENCY') || 'usd',
      metadata: { orderId, userId },
    });

    // ✅ Save paymentIntentId immediately
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentIntentId: paymentIntent.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: order.total,
    };
  }

  async confirmPayment(paymentIntentId: string, userId: string) {
    // ✅ Verify with Stripe first
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== 'succeeded') {
      throw new BadRequestException(
        `Payment not completed. Stripe status: ${intent.status}`,
      );
    }

    // ✅ Look up order — try paymentIntentId first, then metadata as fallback
    let order = await this.prisma.order.findFirst({
      where: { paymentIntentId },
    });

    // Fallback: look up via metadata orderId stored in Stripe
    if (!order && intent.metadata?.orderId) {
      order = await this.prisma.order.findUnique({
        where: { id: intent.metadata.orderId },
      });
    }

    if (!order) {
      throw new BadRequestException(
        `Order not found for paymentIntentId: ${paymentIntentId}`,
      );
    }

    if (order.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (order.paymentStatus === 'PAID') {
      // Already paid — idempotent, just return the order
      return this.prisma.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { product: true } } },
      });
    }

    // ✅ Mark as paid and confirmed
    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        paymentIntentId, // ensure it's saved even via fallback
      },
      include: { items: { include: { product: true } } },
    });
  }
}