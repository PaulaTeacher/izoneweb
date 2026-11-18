import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReviewsService } from './reviews.service';
import { summarizeRatings } from './ratings';
import type { PrismaService } from '../prisma/prisma.service';

describe('ReviewsService', () => {
  const prisma = {
    product: { findUnique: vi.fn() },
    review: { create: vi.fn() },
  };
  let service: ReviewsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ReviewsService(prisma as unknown as PrismaService);
  });

  const dto = { customerName: 'Laura', rating: 5, comment: 'Excelente atención y entrega rápida.' };

  it('stores the review unapproved', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'p1', isActive: true });
    const res = await service.submit('iphone-17-pro', dto);
    expect(res).toEqual({ ok: true, pendingModeration: true });
    expect(prisma.review.create).toHaveBeenCalledWith({
      data: { productId: 'p1', customerName: 'Laura', rating: 5, comment: dto.comment, isApproved: false },
    });
  });

  it('rejects unknown or hidden products', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'p1', isActive: false });
    await expect(service.submit('x', dto)).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('silently drops honeypot submissions', async () => {
    const res = await service.submit('iphone-17-pro', { ...dto, website: 'spam.com' });
    expect(res.ok).toBe(true);
    expect(prisma.product.findUnique).not.toHaveBeenCalled();
    expect(prisma.review.create).not.toHaveBeenCalled();
  });
});

describe('summarizeRatings', () => {
  it('returns null average without reviews', () => {
    expect(summarizeRatings([])).toEqual({ ratingAverage: null, reviewCount: 0 });
  });
  it('averages to one decimal', () => {
    expect(summarizeRatings([{ rating: 5 }, { rating: 4 }, { rating: 4 }])).toEqual({
      ratingAverage: 4.3,
      reviewCount: 3,
    });
  });
});
