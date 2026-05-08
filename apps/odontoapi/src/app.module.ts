import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/config/prisma.module';
import { SubscriberModule } from './infrastructure/config/subscriber.module';
import { ClinicModule } from './infrastructure/config/clinic.module';
import { PatientModule } from './infrastructure/config/patient.module';
import { ProfessionalModule } from './infrastructure/config/professional.module';
import { PlanModule } from './infrastructure/config/plan.module';
import { SubscriptionModule } from './infrastructure/config/subscription.module';
import { HealthModule } from './infrastructure/config/health.module';

@Module({
  imports: [
    PrismaModule,
    SubscriberModule,
    ClinicModule,
    PatientModule,
    ProfessionalModule,
    PlanModule,
    SubscriptionModule,
    HealthModule,
  ],
})
export class AppModule {}
