import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderCronService } from './order-cron.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CronController } from './cron.controller';
import { CronSecretGuard } from './cron-secret.guard';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [CronController],
  providers: [OrderCronService, CronSecretGuard],
})
export class CronModule {}
