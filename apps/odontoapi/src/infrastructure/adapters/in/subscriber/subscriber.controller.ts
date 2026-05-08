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
import { ApiTags } from '@nestjs/swagger';
import type { ApiResponse } from '@odontoehtec/shared';
import type { CreateSubscriberDto } from './create-subscriber.dto';
import type { UpdateSubscriberDto } from './update-subscriber.dto';
import {
  CREATE_SUBSCRIBER_USE_CASE,
  type ICreateSubscriberUseCase,
  type CreateSubscriberOutput,
} from '../../../../domain/ports/in/subscriber/create-subscriber.use-case';
import {
  FIND_SUBSCRIBER_BY_ID_USE_CASE,
  type IFindSubscriberByIdUseCase,
  type FindSubscriberByIdOutput,
} from '../../../../domain/ports/in/subscriber/find-subscriber-by-id.use-case';
import {
  LIST_SUBSCRIBERS_USE_CASE,
  type IListSubscribersUseCase,
  type ListSubscribersOutput,
} from '../../../../domain/ports/in/subscriber/list-subscribers.use-case';
import {
  UPDATE_SUBSCRIBER_USE_CASE,
  type IUpdateSubscriberUseCase,
  type UpdateSubscriberOutput,
} from '../../../../domain/ports/in/subscriber/update-subscriber.use-case';
import {
  DELETE_SUBSCRIBER_USE_CASE,
  type IDeleteSubscriberUseCase,
} from '../../../../domain/ports/in/subscriber/delete-subscriber.use-case';

@Controller('subscribers')
@ApiTags('Subscribers')
export class SubscriberController {
  constructor(
    @Inject(CREATE_SUBSCRIBER_USE_CASE)
    private readonly createSubscriber: ICreateSubscriberUseCase,
    @Inject(FIND_SUBSCRIBER_BY_ID_USE_CASE)
    private readonly findSubscriberById: IFindSubscriberByIdUseCase,
    @Inject(LIST_SUBSCRIBERS_USE_CASE)
    private readonly listSubscribers: IListSubscribersUseCase,
    @Inject(UPDATE_SUBSCRIBER_USE_CASE)
    private readonly updateSubscriber: IUpdateSubscriberUseCase,
    @Inject(DELETE_SUBSCRIBER_USE_CASE)
    private readonly deleteSubscriber: IDeleteSubscriberUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriberDto): Promise<ApiResponse<CreateSubscriberOutput>> {
    const data = await this.createSubscriber.execute(dto);
    return { data, message: 'Assinante criado com sucesso' };
  }

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListSubscribersOutput>> {
    const data = await this.listSubscribers.execute({
      page: Number(page),
      limit: Number(limit),
    });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindSubscriberByIdOutput>> {
    const data = await this.findSubscriberById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriberDto
  ): Promise<ApiResponse<UpdateSubscriberOutput>> {
    const data = await this.updateSubscriber.execute({ id, ...dto });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteSubscriber.execute({ id });
  }
}
