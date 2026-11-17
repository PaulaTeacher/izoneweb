import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderCronService {
  private readonly logger = new Logger(OrderCronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async releaseExpiredReservations() {
    this.logger.debug('Running cron job to release expired stock reservations...');

    try {
      const expiredOrders = await this.prisma.order.findMany({
        where: {
          status: 'reserved',
          reservedUntil: { lt: new Date() },
        },
        include: {
          items: true,
        },
      });

      if (expiredOrders.length === 0) {
        return;
      }

      for (const order of expiredOrders) {
        await this.prisma.$transaction(async (tx) => {
          // Revert stock for each item
          for (const item of order.items) {
            if (item.variantId) {
              await tx.variant.updateMany({
                where: {
                  id: item.variantId,
                  reservedStock: { gte: item.quantity },
                },
                data: {
                  reservedStock: { decrement: item.quantity },
                },
              });
            }
          }

          // Update order status to cancelled
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'cancelled' },
          });
        });

        this.logger.log(`Released stock for expired order ${order.id}`);
      }
    } catch (error) {
      this.logger.error('Error releasing expired stock reservations', error);
    }
  }
}
