import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

export interface ReleaseResult {
  /** Órdenes vencidas encontradas. */
  expired: number;
  /** Órdenes realmente canceladas (otra ejecución pudo ganarse alguna). */
  released: number;
}

/**
 * Cron interno: útil en dev local. En Cloud Run (escala a cero) no corre de forma
 * fiable, así que allí lo dispara Cloud Scheduler vía POST /cron/release-expired.
 * ENABLE_INTERNAL_CRON=true|false; si no está definida: activo salvo en producción.
 */
export function internalCronEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const flag = env.ENABLE_INTERNAL_CRON?.trim().toLowerCase();
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return env.NODE_ENV !== 'production';
}

@Injectable()
export class OrderCronService {
  private readonly logger = new Logger(OrderCronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async runInternalCron(): Promise<void> {
    if (!internalCronEnabled()) return;
    try {
      await this.releaseExpiredReservations();
    } catch (error) {
      this.logger.error('Error releasing expired stock reservations', error);
    }
  }

  /**
   * Cancela las órdenes `reserved` con la reserva vencida y devuelve su stock.
   * Idempotente: la cancelación es condicional al estado, así que dos ejecuciones
   * simultáneas no descuentan el stock dos veces. Lanza si la BD falla.
   */
  async releaseExpiredReservations(now: Date = new Date()): Promise<ReleaseResult> {
    const expiredOrders = await this.prisma.order.findMany({
      where: {
        status: 'reserved',
        reservedUntil: { lt: now },
      },
      include: {
        items: true,
      },
    });

    let released = 0;
    for (const order of expiredOrders) {
      const cancelled = await this.prisma.$transaction(async (tx) => {
        const { count } = await tx.order.updateMany({
          where: { id: order.id, status: 'reserved' },
          data: { status: 'cancelled' },
        });
        if (count === 0) return false; // ya la canceló/confirmó otro proceso

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
        return true;
      });

      if (cancelled) {
        released++;
        this.logger.log(`Released stock for expired order ${order.id}`);
      }
    }

    return { expired: expiredOrders.length, released };
  }
}
