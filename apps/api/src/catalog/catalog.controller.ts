import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Listar productos con filtros' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'brand', required: false })
  getProducts(
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('tag') tagSlug?: string,
    @Query('brand') brandSlug?: string,
  ) {
    return this.catalogService.getProducts({ categorySlug, search, tagSlug, brandSlug });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar todas las categorías' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('menu')
  @ApiOperation({ summary: 'Árbol de navegación (familias + subcategorías + destacado)' })
  getMenu() {
    return this.catalogService.getMenu();
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Obtener un producto por slug' })
  getProductBySlug(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }
}
