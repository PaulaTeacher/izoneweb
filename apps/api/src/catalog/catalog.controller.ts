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
  @ApiQuery({ name: 'productKind', required: false, description: 'equipment | accessory' })
  @ApiQuery({ name: 'compatibleWith', required: false, description: 'Slug de DeviceModel (ej. iphone-16-pro)' })
  @ApiQuery({ name: 'material', required: false, description: 'silicona | cuero | hibrido | diseno | otro' })
  @ApiQuery({ name: 'deviceBrand', required: false, description: 'Slug de marca del dispositivo (apple, samsung)' })
  @ApiQuery({ name: 'deviceKind', required: false, description: 'phone | tablet | laptop | watch' })
  @ApiQuery({ name: 'featured', required: false, description: 'true = solo productos destacados (Home)' })
  @ApiQuery({ name: 'take', required: false, description: 'Límite de resultados (máx. 48)' })
  getProducts(
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('tag') tagSlug?: string,
    @Query('brand') brandSlug?: string,
    @Query('condition') condition?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sort') sort?: string,
    @Query('productKind') productKind?: string,
    @Query('compatibleWith') compatibleWith?: string,
    @Query('material') material?: string,
    @Query('deviceBrand') deviceBrand?: string,
    @Query('deviceKind') deviceKind?: string,
    @Query('featured') featured?: string,
    @Query('take') take?: string,
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
      productKind,
      compatibleWith,
      material,
      deviceBrand,
      deviceKind,
      featured: featured === 'true' || featured === '1',
      take: take ? Number(take) : undefined,
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar familias de categoría (con subcategorías)' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('menu')
  @ApiOperation({ summary: 'Árbol de navegación (familias + subcategorías + destacado)' })
  getMenu() {
    return this.catalogService.getMenu();
  }

  @Get('brands')
  @ApiOperation({ summary: 'Listar todas las marcas' })
  getBrands() {
    return this.catalogService.getBrands();
  }

  @Get('device-models')
  @ApiOperation({ summary: 'Listar modelos de dispositivo para el finder de accesorios' })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'kind', required: false, description: 'phone | tablet | laptop | watch' })
  getDeviceModels(
    @Query('brand') brandSlug?: string,
    @Query('kind') kind?: string,
  ) {
    return this.catalogService.getDeviceModels({ brandSlug, kind });
  }

  @Get('products/:slug/accessories')
  @ApiOperation({ summary: 'Accesorios compatibles con un producto o modelo' })
  @ApiQuery({ name: 'limit', required: false })
  getAccessoriesForProduct(
    @Param('slug') slug: string,
    @Query('limit') limit?: string,
  ) {
    return this.catalogService.getAccessoriesForProduct(
      slug,
      limit ? Number(limit) : 8,
    );
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
