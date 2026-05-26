import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Lang } from '../common/helpers/localize.helper';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // ✅ Static routes FIRST — before any :id param route
  @Get('categories')
  findCategories(@Req() req: Request) {
    const lang = (req as any).lang as Lang;
    return this.productsService.findAllCategories(lang);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }
  
  @Get('admin/categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAdminCategories() {
    return this.productsService.findAdminCategories();
  }
  // ✅ Dynamic :id routes AFTER static ones
  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const lang = (req as any).lang as Lang;
    return this.productsService.findOne(id, lang);
  }

  @Get()
  findAll(@Req() req: Request, @Query('categoryId') categoryId?: string) {
    const lang = (req as any).lang as Lang;
    return this.productsService.findAll(lang, categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createCategory(@Body() body: { nameEn: string; nameAr: string }) {
    return this.productsService.createCategory(body.nameEn, body.nameAr);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
