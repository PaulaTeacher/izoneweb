import { Body, Controller, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Catalog')
@Controller('catalog')
@Public()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('products/:slug/reviews')
  // Máx. 3 reseñas por IP cada 10 minutos.
  @Throttle({ default: { limit: 3, ttl: 600_000 } })
  @ApiOperation({ summary: 'Enviar reseña (queda pendiente de moderación)' })
  submit(@Param('slug') slug: string, @Body() body: CreateReviewDto) {
    return this.reviewsService.submit(slug, body);
  }
}
