import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  /**
   * Conecta en segundo plano: no bloquea el arranque (Cloud Run mide hasta que se
   * escucha en $PORT). Si falla, Prisma reintenta solo en la primera consulta.
   */
  onModuleInit() {
    const started = Date.now();
    this.$connect()
      .then(() => this.logger.log(`Database connected in ${Date.now() - started}ms`))
      .catch((error: unknown) =>
        this.logger.error(
          `Database connection failed: ${error instanceof Error ? error.message : 'unknown error'}`,
        ),
      );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
