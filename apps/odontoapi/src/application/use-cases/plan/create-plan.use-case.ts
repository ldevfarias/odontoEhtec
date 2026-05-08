import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  ICreatePlanUseCase,
  CreatePlanInput,
  CreatePlanOutput,
} from '../../../domain/ports/in/plan/create-plan.use-case';
import { PLAN_REPOSITORY, type IPlanRepository } from '../../../domain/ports/out/plan.repository';

@Injectable()
export class CreatePlanUseCase implements ICreatePlanUseCase {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository
  ) {}

  async execute(input: CreatePlanInput): Promise<CreatePlanOutput> {
    const existing = await this.planRepository.findByName(input.name);
    if (existing) throw new ConflictException('Nome de plano já cadastrado');

    const plan = await this.planRepository.create({
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      isActive: input.isActive ?? true,
    });

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
