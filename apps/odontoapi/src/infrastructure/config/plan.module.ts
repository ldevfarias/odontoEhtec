import { Module } from '@nestjs/common';
import { PLAN_REPOSITORY } from '../../domain/ports/out/plan.repository';
import { CREATE_PLAN_USE_CASE } from '../../domain/ports/in/plan/create-plan.use-case';
import { FIND_PLAN_BY_ID_USE_CASE } from '../../domain/ports/in/plan/find-plan-by-id.use-case';
import { LIST_PLANS_USE_CASE } from '../../domain/ports/in/plan/list-plans.use-case';
import { UPDATE_PLAN_USE_CASE } from '../../domain/ports/in/plan/update-plan.use-case';
import { DELETE_PLAN_USE_CASE } from '../../domain/ports/in/plan/delete-plan.use-case';
import { DrizzlePlanRepository } from '../adapters/out/drizzle-plan.repository';
import { CreatePlanUseCase } from '../../application/use-cases/plan/create-plan.use-case';
import { FindPlanByIdUseCase } from '../../application/use-cases/plan/find-plan-by-id.use-case';
import { ListPlansUseCase } from '../../application/use-cases/plan/list-plans.use-case';
import { UpdatePlanUseCase } from '../../application/use-cases/plan/update-plan.use-case';
import { DeletePlanUseCase } from '../../application/use-cases/plan/delete-plan.use-case';
import { PlanController } from '../adapters/in/plan/plan.controller';

@Module({
  providers: [
    { provide: PLAN_REPOSITORY, useClass: DrizzlePlanRepository },
    { provide: CREATE_PLAN_USE_CASE, useClass: CreatePlanUseCase },
    { provide: FIND_PLAN_BY_ID_USE_CASE, useClass: FindPlanByIdUseCase },
    { provide: LIST_PLANS_USE_CASE, useClass: ListPlansUseCase },
    { provide: UPDATE_PLAN_USE_CASE, useClass: UpdatePlanUseCase },
    { provide: DELETE_PLAN_USE_CASE, useClass: DeletePlanUseCase },
  ],
  controllers: [PlanController],
  exports: [PLAN_REPOSITORY],
})
export class PlanModule {}
