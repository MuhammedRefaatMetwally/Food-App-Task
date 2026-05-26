import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { localize, localizeArray, Lang } from '../common/helpers/localize.helper';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang: Lang, categoryId?: string) {
    const products = await this.prisma.product.findMany({
      where: {
        available: true,
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return localizeArray(products, lang);
  }

  async findAllAdmin() {
    // Admin always gets both languages — no localization needed
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, lang: Lang) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return localize(product, lang);
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.prisma.product.findUniqueOrThrow({ where: { id } });
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string) {
    await this.prisma.product.findUniqueOrThrow({ where: { id } });
    return this.prisma.product.delete({ where: { id } });
  }

  async findAllCategories(lang: Lang) {
    const cats = await this.prisma.category.findMany();
    return localizeArray(cats, lang);
  }

  createCategory(nameEn: string, nameAr: string) {
    return this.prisma.category.create({ data: { nameEn, nameAr } });
  }
}