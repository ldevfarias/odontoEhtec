import { Module } from '@nestjs/common';
import { SUBSCRIPTION_REPOSITORY } from '../../domain/ports/out/subscription.repository';
import { CREATE_SUBSCRIPTION_USE_CASE } from '../../domain/ports/in/subscription/create-subscription.use-case';
import { FIND_SUBSCRIPTION_BY_ID_USE_CASE } from '../../domain/ports/in/subscription/find-subscription-by-id.use-case';
import { LIST_SUBSCRIPTIONS_USE_CASE } from '../../domain/ports/in/subscription/list-subscriptions.use-case';
import { UPDATE_SUBSCRIPTION_USE_CASE } from '../../domain/ports/in/subscription/update-subscription.use-case';
import { DELETE_SUBSCRIPTION_USE_CASE } from '../../domain/ports/in/subscription/delete-subscription.use-case';
import { PrismaSubscriptionRepository } from '../adapters/out/prisma-subscription.repository';
import { CreateSubscriptionUseCase } from '../../application/use-cases/subscription/create-subscription.use-case';
import { FindSubscriptionByIdUseCase } from '../../application/use-cases/subscription/find-subscription-by-id.use-case';
import { ListSubscriptionsUseCase } from '../../application/use-cases/subscription/list-subscriptions.use-case';
import { UpdateSubscriptionUseCase } from '../../application/use-cases/subscription/update-subscription.use-case';
import { DeleteSubscriptionUseCase } from '../../application/use-cases/subscription/delete-subscription.use-case';
import { SubscriptionController } from '../adapters/in/subscription/subscription.controller';
import { SubscriberModule } from './subscriber.module';
import { PlanModule } from './plan.module';

@Module({
  imports: [SubscriberModule, PlanModule],
  providers: [
    { provide: SUBSCRIPTION_REPOSITORY, useClass: PrismaSubscriptionRepository },
    { provide: CREATE_SUBSCRIPTION_USE_CASE, useClass: CreateSubscriptionUseCase },
    { provide: FIND_SUBSCRIPTION_BY_ID_USE_CASE, useClass: FindSubscriptionByIdUseCase },
    { provide: LIST_SUBSCRIPTIONS_USE_CASE, useClass: ListSubscriptionsUseCase },
    { provide: UPDATE_SUBSCRIPTION_USE_CASE, useClass: UpdateSubscriptionUseCase },
    { provide: DELETE_SUBSCRIPTION_USE_CASE, useClass: DeleteSubscriptionUseCase },
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
