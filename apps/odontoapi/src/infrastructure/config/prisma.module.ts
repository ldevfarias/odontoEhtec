import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../adapters/out/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
