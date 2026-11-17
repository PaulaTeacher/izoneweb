import { Type } from 'class-transformer';
import { AccessoryMaterial, ProductCondition } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  subtitle?: string | null;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  warrantyMonths?: number;
}

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  sku?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  comparePrice?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsString()
  colorName?: string | null;

  @IsOptional()
  @IsString()
  colorHex?: string | null;

  @IsOptional()
  @IsString()
  storage?: string | null;

  @IsOptional()
  @IsString()
  featuredImage?: string | null;

  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @IsOptional()
  @IsEnum(AccessoryMaterial)
  material?: AccessoryMaterial | null;
}

export class CreateVariantDto {
  @IsString()
  @MinLength(2)
  sku!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  comparePrice?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsString()
  colorName?: string | null;

  @IsOptional()
  @IsString()
  colorHex?: string | null;

  @IsOptional()
  @IsString()
  storage?: string | null;

  @IsOptional()
  @IsString()
  featuredImage?: string | null;

  @IsOptional()
  @IsEnum(ProductCondition)
  condition?: ProductCondition;

  @IsOptional()
  @IsEnum(AccessoryMaterial)
  material?: AccessoryMaterial | null;
}

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  brandId!: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  productKind?: 'equipment' | 'accessory';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  seoTitle?: string | null;

  @IsOptional()
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}

/** Variante en guardado atómico (crear o actualizar). */
export class UpsertVariantDto extends CreateVariantDto {
  @IsOptional()
  @IsString()
  id?: string;
}

/** Guarda producto + variantes en una sola transacción (evita estados a medias). */
export class UpdateProductBundleDto extends UpdateProductDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertVariantDto)
  variants?: UpsertVariantDto[];
}
