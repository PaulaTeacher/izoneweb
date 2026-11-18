import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [CatalogController, ReviewsController],
  providers: [CatalogService, ReviewsService],
})
export class CatalogModule {}
