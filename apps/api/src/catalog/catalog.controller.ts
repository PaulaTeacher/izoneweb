import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Public } from '../auth/decorators';

@ApiTags('Catalog')
@Controller('catalog')
@Public()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Listar productos con filtros' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'condition', required: false, description: 'NUEVO_SELLADO | SEMINUEVO_CERTIFICADO | OPEN_BOX' })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'sort', required: false, description: 'price_asc | price_desc | newest | name_asc' })
  getProducts(
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('tag') tagSlug?: string,
    @Query('brand') brandSlug?: string,
    @Query('condition') condition?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: string,
  ) {
    return this.catalogService.getProducts({
      categorySlug,
      search,
      tagSlug,
      brandSlug,
      condition,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar todas las categorías' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('brands')
  @ApiOperation({ summary: 'Listar todas las marcas' })
  getBrands() {
    return this.catalogService.getBrands();
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Obtener un producto por slug (con variantes, specs y reviews)' })
  getProductBySlug(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Comparar especificaciones de hasta 3 productos' })
  @ApiQuery({ name: 'slugs', required: true, description: 'Slugs separados por coma (máximo 3)' })
  compareProducts(@Query('slugs') slugs: string) {
    const slugList = slugs.split(',').slice(0, 3).map((s) => s.trim());
    return this.catalogService.compareProducts(slugList);
  }
}
