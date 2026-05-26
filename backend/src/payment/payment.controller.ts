import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsString } from 'class-validator';

class CreatePaymentIntentDto {
  @IsString()
  orderId!: string;
}

class ConfirmPaymentDto {
  @IsString()
  paymentIntentId!: string;
}

@Controller('payment')
@UseGuards(JwtAuthGuard)  
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-intent')
  createIntent(@CurrentUser() user: any, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(dto.orderId, user.id);
  }

  @Post('confirm')
  confirm(@CurrentUser() user: any, @Body() dto: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(dto.paymentIntentId, user.id);
  }
}