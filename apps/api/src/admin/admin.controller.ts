import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators';
import { AdminService } from './admin.service';
import {
  CreateProductDto,
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
  @ApiOperation({ summary: 'Actualizar producto' })
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.adminService.updateProduct(id, body);
  }

  @Post('products')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Crear producto (sin variantes)' })
  createProduct(@Body() body: CreateProductDto) {
    return this.adminService.createProduct(body);
  }

  @Patch('variants/:id')
  @Roles(...CATALOG_ROLES)
  @ApiOperation({ summary: 'Actualizar precio/stock de variante' })
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
