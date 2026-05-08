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
import type { CreatePlanDto } from './create-plan.dto';
import type { UpdatePlanDto } from './update-plan.dto';
import {
  CREATE_PLAN_USE_CASE,
  type ICreatePlanUseCase,
  type CreatePlanOutput,
} from '../../../../domain/ports/in/plan/create-plan.use-case';
import {
  FIND_PLAN_BY_ID_USE_CASE,
  type IFindPlanByIdUseCase,
  type FindPlanByIdOutput,
} from '../../../../domain/ports/in/plan/find-plan-by-id.use-case';
import {
  LIST_PLANS_USE_CASE,
  type IListPlansUseCase,
  type ListPlansOutput,
} from '../../../../domain/ports/in/plan/list-plans.use-case';
import {
  UPDATE_PLAN_USE_CASE,
  type IUpdatePlanUseCase,
  type UpdatePlanOutput,
} from '../../../../domain/ports/in/plan/update-plan.use-case';
import {
  DELETE_PLAN_USE_CASE,
  type IDeletePlanUseCase,
} from '../../../../domain/ports/in/plan/delete-plan.use-case';

@Controller('plans')
@ApiTags('Plans')
export class PlanController {
  constructor(
    @Inject(CREATE_PLAN_USE_CASE)
    private readonly createPlan: ICreatePlanUseCase,
    @Inject(FIND_PLAN_BY_ID_USE_CASE)
    private readonly findPlanById: IFindPlanByIdUseCase,
    @Inject(LIST_PLANS_USE_CASE)
    private readonly listPlans: IListPlansUseCase,
    @Inject(UPDATE_PLAN_USE_CASE)
    private readonly updatePlan: IUpdatePlanUseCase,
    @Inject(DELETE_PLAN_USE_CASE)
    private readonly deletePlan: IDeletePlanUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreatePlanDto): Promise<ApiResponse<CreatePlanOutput>> {
    const data = await this.createPlan.execute(dto);
    return { data, message: 'Plano criado com sucesso' };
  }

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListPlansOutput>> {
    const data = await this.listPlans.execute({ page: Number(page), limit: Number(limit) });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindPlanByIdOutput>> {
    const data = await this.findPlanById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto
  ): Promise<ApiResponse<UpdatePlanOutput>> {
    const data = await this.updatePlan.execute({ id, ...dto });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deletePlan.execute({ id });
  }
}
