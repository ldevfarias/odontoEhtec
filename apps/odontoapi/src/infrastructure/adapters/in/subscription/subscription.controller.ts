import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { ApiResponse } from '@odontoehtec/shared';
import type { CreateSubscriptionDto } from './create-subscription.dto';
import type { UpdateSubscriptionDto } from './update-subscription.dto';
import {
  CREATE_SUBSCRIPTION_USE_CASE,
  type ICreateSubscriptionUseCase,
  type CreateSubscriptionOutput,
} from '../../../../domain/ports/in/subscription/create-subscription.use-case';
import {
  FIND_SUBSCRIPTION_BY_ID_USE_CASE,
  type IFindSubscriptionByIdUseCase,
  type FindSubscriptionByIdOutput,
} from '../../../../domain/ports/in/subscription/find-subscription-by-id.use-case';
import {
  LIST_SUBSCRIPTIONS_USE_CASE,
  type IListSubscriptionsUseCase,
  type ListSubscriptionsOutput,
} from '../../../../domain/ports/in/subscription/list-subscriptions.use-case';
import {
  UPDATE_SUBSCRIPTION_USE_CASE,
  type IUpdateSubscriptionUseCase,
  type UpdateSubscriptionOutput,
} from '../../../../domain/ports/in/subscription/update-subscription.use-case';
import {
  DELETE_SUBSCRIPTION_USE_CASE,
  type IDeleteSubscriptionUseCase,
} from '../../../../domain/ports/in/subscription/delete-subscription.use-case';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    @Inject(CREATE_SUBSCRIPTION_USE_CASE)
    private readonly createSubscription: ICreateSubscriptionUseCase,
    @Inject(FIND_SUBSCRIPTION_BY_ID_USE_CASE)
    private readonly findSubscriptionById: IFindSubscriptionByIdUseCase,
    @Inject(LIST_SUBSCRIPTIONS_USE_CASE)
    private readonly listSubscriptions: IListSubscriptionsUseCase,
    @Inject(UPDATE_SUBSCRIPTION_USE_CASE)
    private readonly updateSubscription: IUpdateSubscriptionUseCase,
    @Inject(DELETE_SUBSCRIPTION_USE_CASE)
    private readonly deleteSubscription: IDeleteSubscriptionUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriptionDto): Promise<ApiResponse<CreateSubscriptionOutput>> {
    const data = await this.createSubscription.execute({
      subscriberId: dto.subscriberId,
      planId: dto.planId,
      status: dto.status,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    });
    return { data, message: 'Assinatura criada com sucesso' };
  }

  @Get()
  async list(
    @Query('subscriberId') subscriberId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListSubscriptionsOutput>> {
    const data = await this.listSubscriptions.execute({
      subscriberId,
      page: Number(page),
      limit: Number(limit),
    });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindSubscriptionByIdOutput>> {
    const data = await this.findSubscriptionById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto
  ): Promise<ApiResponse<UpdateSubscriptionOutput>> {
    const data = await this.updateSubscription.execute({
      id,
      status: dto.status,
      endDate: dto.endDate !== undefined ? (dto.endDate ? new Date(dto.endDate) : null) : undefined,
    });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteSubscription.execute({ id });
  }
}
