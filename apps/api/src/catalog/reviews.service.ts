import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Public submission. Reviews are stored unapproved and only appear on the
   * storefront (and in schema.org) after an admin approves them.
   */
  async submit(slug: string, dto: CreateReviewDto) {
    // Honeypot filled → pretend success, store nothing.
    if (dto.website) return { ok: true, pendingModeration: true };

    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: { id: true, isActive: true },
    });
    if (!product || !product.isActive) {
      throw new NotFoundException(`Producto "${slug}" no encontrado`);
    }

    await this.prisma.review.create({
      data: {
        productId: product.id,
        customerName: dto.customerName,
        rating: dto.rating,
        comment: dto.comment,
        isApproved: false,
      },
    });
    return { ok: true, pendingModeration: true };
  }
}
