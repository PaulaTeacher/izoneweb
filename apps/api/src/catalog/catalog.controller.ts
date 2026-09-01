import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Listar productos con filtros' })
  getProducts(@Query('category') categorySlug?: string, @Query('search') search?: string) {
    return this.catalogService.getProducts({ categorySlug, search });
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Obtener un producto por slug' })
  getProductBySlug(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }
}
