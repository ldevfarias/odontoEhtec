import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdatePlanUseCase,
  UpdatePlanInput,
  UpdatePlanOutput,
} from '../../../domain/ports/in/plan/update-plan.use-case';
import { PLAN_REPOSITORY, type IPlanRepository } from '../../../domain/ports/out/plan.repository';

@Injectable()
export class UpdatePlanUseCase implements IUpdatePlanUseCase {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository
  ) {}

  async execute(input: UpdatePlanInput): Promise<UpdatePlanOutput> {
    const plan = await this.planRepository.findById(input.id);
    if (!plan) throw new NotFoundException('Plano não encontrado');

    const updated = await this.planRepository.update(input.id, {
      name: input.name,
      description: input.description,
      price: input.price !== undefined ? String(input.price) : undefined,
      isActive: input.isActive,
    });

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      price: Number(updated.price),
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
