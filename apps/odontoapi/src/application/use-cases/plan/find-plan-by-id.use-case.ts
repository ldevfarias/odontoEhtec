import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindPlanByIdUseCase,
  FindPlanByIdInput,
  FindPlanByIdOutput,
} from '../../../domain/ports/in/plan/find-plan-by-id.use-case';
import { PLAN_REPOSITORY, type IPlanRepository } from '../../../domain/ports/out/plan.repository';

@Injectable()
export class FindPlanByIdUseCase implements IFindPlanByIdUseCase {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository
  ) {}

  async execute(input: FindPlanByIdInput): Promise<FindPlanByIdOutput> {
    const plan = await this.planRepository.findById(input.id);
    if (!plan) throw new NotFoundException('Plano não encontrado');

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: Number(plan.price),
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
