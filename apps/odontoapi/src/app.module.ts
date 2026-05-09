import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './infrastructure/config/auth.module';
import { ClinicModule } from './infrastructure/config/clinic.module';
import { HealthModule } from './infrastructure/config/health.module';
import { PatientModule } from './infrastructure/config/patient.module';
import { PlanModule } from './infrastructure/config/plan.module';
import { DrizzleModule } from './infrastructure/config/drizzle.module';
import { ProfessionalModule } from './infrastructure/config/professional.module';
import { SubscriberModule } from './infrastructure/config/subscriber.module';
import { SubscriptionModule } from './infrastructure/config/subscription.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    DrizzleModule,
    SubscriberModule,
    ClinicModule,
    PatientModule,
    ProfessionalModule,
    PlanModule,
    SubscriptionModule,
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
