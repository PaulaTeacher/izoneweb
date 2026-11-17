import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OrderCronService } from './order-cron.service';

describe('OrderCronService.releaseExpiredReservations', () => {
  const tx = {
    variant: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
    order: { update: vi.fn().mockResolvedValue({}) },
  };

  const prisma = {
    order: { findMany: vi.fn() },
    $transaction: vi.fn((fn: (client: typeof tx) => Promise<unknown>) => fn(tx)),
  };

  let service: OrderCronService;

  beforeEach(() => {
    vi.clearAllMocks();
    prisma.$transaction.mockImplementation((fn: (client: typeof tx) => Promise<unknown>) => fn(tx));
    service = new OrderCronService(prisma as never);
  });

  it('no hace nada si no hay reservas vencidas', async () => {
    prisma.order.findMany.mockResolvedValue([]);

    await service.releaseExpiredReservations();

    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('busca solo órdenes reservadas cuya reserva ya venció', async () => {
    prisma.order.findMany.mockResolvedValue([]);

    await service.releaseExpiredReservations();

    const where = prisma.order.findMany.mock.calls[0][0].where;
    expect(where.status).toBe('reserved');
    expect(where.reservedUntil.lt).toBeInstanceOf(Date);
  });

  it('devuelve el stock reservado y cancela la orden', async () => {
    prisma.order.findMany.mockResolvedValue([
      {
        id: 'order-1',
        items: [
          { variantId: 'var-1', quantity: 2 },
          { variantId: 'var-2', quantity: 1 },
        ],
      },
    ]);

    await service.releaseExpiredReservations();

    expect(tx.variant.updateMany).toHaveBeenCalledTimes(2);
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: { id: 'var-1', reservedStock: { gte: 2 } },
      data: { reservedStock: { decrement: 2 } },
    });
    expect(tx.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'cancelled' },
    });
  });

  it('omite items sin variante pero igual cancela la orden', async () => {
    prisma.order.findMany.mockResolvedValue([
      { id: 'order-2', items: [{ variantId: null, quantity: 1 }] },
    ]);

    await service.releaseExpiredReservations();

    expect(tx.variant.updateMany).not.toHaveBeenCalled();
    expect(tx.order.update).toHaveBeenCalledTimes(1);
  });

  it('no lanza si la base de datos falla', async () => {
    prisma.order.findMany.mockRejectedValue(new Error('db down'));

    await expect(service.releaseExpiredReservations()).resolves.toBeUndefined();
  });
});
