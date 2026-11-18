import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogModule } from './catalog/catalog.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule, JwtAuthGuard, RolesGuard } from './auth';
import { CronModule } from './cron/cron.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 30,
      },
      {
        name: 'checkout',
        ttl: 60000,
        limit: 5,
      },
    ]),
    PrismaModule,
    AuthModule,
    CatalogModule,
    WhatsappModule,
    AdminModule,
    CronModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
