import { Module } from '@nestjs/common';
import { SUBSCRIBER_REPOSITORY } from '../../domain/ports/out/subscriber.repository';
import { CREATE_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/subscriber/create-subscriber.use-case';
import { FIND_SUBSCRIBER_BY_ID_USE_CASE } from '../../domain/ports/in/subscriber/find-subscriber-by-id.use-case';
import { LIST_SUBSCRIBERS_USE_CASE } from '../../domain/ports/in/subscriber/list-subscribers.use-case';
import { UPDATE_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/subscriber/update-subscriber.use-case';
import { DELETE_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/subscriber/delete-subscriber.use-case';
import { PrismaSubscriberRepository } from '../adapters/out/prisma-subscriber.repository';
import { CreateSubscriberUseCase } from '../../application/use-cases/subscriber/create-subscriber.use-case';
import { FindSubscriberByIdUseCase } from '../../application/use-cases/subscriber/find-subscriber-by-id.use-case';
import { ListSubscribersUseCase } from '../../application/use-cases/subscriber/list-subscribers.use-case';
import { UpdateSubscriberUseCase } from '../../application/use-cases/subscriber/update-subscriber.use-case';
import { DeleteSubscriberUseCase } from '../../application/use-cases/subscriber/delete-subscriber.use-case';
import { SubscriberController } from '../adapters/in/subscriber/subscriber.controller';

@Module({
  providers: [
    { provide: SUBSCRIBER_REPOSITORY, useClass: PrismaSubscriberRepository },
    { provide: CREATE_SUBSCRIBER_USE_CASE, useClass: CreateSubscriberUseCase },
    { provide: FIND_SUBSCRIBER_BY_ID_USE_CASE, useClass: FindSubscriberByIdUseCase },
    { provide: LIST_SUBSCRIBERS_USE_CASE, useClass: ListSubscribersUseCase },
    { provide: UPDATE_SUBSCRIBER_USE_CASE, useClass: UpdateSubscriberUseCase },
    { provide: DELETE_SUBSCRIBER_USE_CASE, useClass: DeleteSubscriberUseCase },
  ],
  controllers: [SubscriberController],
  exports: [SUBSCRIBER_REPOSITORY],
})
export class SubscriberModule {}
