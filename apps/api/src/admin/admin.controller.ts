import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { AdminService } from './admin.service';
import {
  CreateProductDto,
  CreateVariantDto,
  UpdateProductBundleDto,
  UpdateProductDto,
  UpdateVariantDto,
} from './dto/admin-catalog.dto';

const CATALOG_ROLES = ['SUPERADMIN', 'ADMIN_INVENTARIO', 'EDITOR'] as const;

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Listar productos (admin)' })
  listProducts(
    @Query('search') search?: string,
    @Query('productKind') productKind?: string,
    @Query('take') take?: string,
  ) {
    return this.adminService.listProducts({
      search,
      productKind,
      take: take ? Number(take) : undefined,
    });
  }

  @Get('products/:id')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Detalle de producto (admin)' })
  getProduct(@Param('id') id: string) {
    return this.adminService.getProduct(id);
  }

  @Patch('products/:id')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Actualizar producto (incluye imágenes)' })
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.adminService.updateProduct(id, body);
  }

  @Put('products/:id')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({
    summary: 'Guardado atómico producto + variantes (recomendado para el panel)',
  })
  updateProductBundle(
    @Param('id') id: string,
    @Body() body: UpdateProductBundleDto,
  ) {
    return this.adminService.updateProductBundle(id, body);
  }

  @Post('products')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Crear producto con variantes opcionales' })
  createProduct(@Body() body: CreateProductDto) {
    return this.adminService.createProduct(body);
  }

  @Post('products/:id/variants')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Agregar variante a un producto' })
  createVariant(@Param('id') id: string, @Body() body: CreateVariantDto) {
    return this.adminService.createVariant(id, body);
  }

  @Patch('variants/:id')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Actualizar variante (precio, stock, imagen, attrs)' })
  updateVariant(@Param('id') id: string, @Body() body: UpdateVariantDto) {
    return this.adminService.updateVariant(id, body);
  }

  @Get('brands')
  @Roles(...CATALOG_ROLES)
  listBrands() {
    return this.adminService.listBrands();
  }

  @Get('categories')
  @Roles(...CATALOG_ROLES)
  listCategories() {
    return this.adminService.listCategories();
  }
}
