import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/config/prisma.module';
import { SubscriberModule } from './infrastructure/config/subscriber.module';

@Module({
  imports: [PrismaModule, SubscriberModule],
})
export class AppModule {}
