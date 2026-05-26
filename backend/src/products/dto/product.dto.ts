import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() nameEn!: string;
  @IsString() nameAr!: string;
  @IsString() descEn!: string;
  @IsString() descAr!: string;
  @IsNumber() @Min(0) price!: number;
  @IsString() image!: string;
  @IsUUID() categoryId!: string;
  @IsBoolean() @IsOptional() available?: boolean;
}

export class UpdateProductDto {
  @IsString() @IsOptional() nameEn?: string;
  @IsString() @IsOptional() nameAr?: string;
  @IsString() @IsOptional() descEn?: string;
  @IsString() @IsOptional() descAr?: string;
  @IsNumber() @Min(0) @IsOptional() price?: number;
  @IsString() @IsOptional() image?: string;
  @IsBoolean() @IsOptional() available?: boolean;
  @IsUUID() @IsOptional() categoryId?: string;
}