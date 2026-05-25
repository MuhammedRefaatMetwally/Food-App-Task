import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Public routes
  @Get()
  findAll(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAll(categoryId);
  }

  @Get('categories')
  findCategories() {
    return this.productsService.findAllCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // Admin routes
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createCategory(@Body() body: { nameEn: string; nameAr: string }) {
    return this.productsService.createCategory(body.nameEn, body.nameAr);
  }
}