import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(categoryId?: string) {
    return this.prisma.product.findMany({
      where: {
        available: true,
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllAdmin() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  findAllCategories() {
    return this.prisma.category.findMany({ include: { products: false } });
  }

  createCategory(nameEn: string, nameAr: string) {
    return this.prisma.category.create({ data: { nameEn, nameAr } });
  }
}