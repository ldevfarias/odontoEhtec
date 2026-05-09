import { Global, Module } from '@nestjs/common';
import { DrizzleService } from '../adapters/out/drizzle.service';

@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
