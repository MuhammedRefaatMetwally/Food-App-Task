import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // Customer: place order
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  // Customer: my orders
  @Get('my-orders')
  findMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findMyOrders(user.id);
  }

  // Customer: single order
  @Get('my-orders/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user.id);
  }

  // Admin: all orders
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll(@Query('status') status?: string) {
    return this.ordersService.findAll(status);
  }

  // Admin: update status
  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  // Admin: dashboard stats
  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  getStats() {
    return this.ordersService.getStats();
  }
}