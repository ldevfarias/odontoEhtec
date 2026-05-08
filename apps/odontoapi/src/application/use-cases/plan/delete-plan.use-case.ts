import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeletePlanUseCase,
  DeletePlanInput,
} from '../../../domain/ports/in/plan/delete-plan.use-case';
import { PLAN_REPOSITORY, type IPlanRepository } from '../../../domain/ports/out/plan.repository';

@Injectable()
export class DeletePlanUseCase implements IDeletePlanUseCase {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository
  ) {}

  async execute(input: DeletePlanInput): Promise<void> {
    const plan = await this.planRepository.findById(input.id);
    if (!plan) throw new NotFoundException('Plano não encontrado');

    await this.planRepository.delete(input.id);
  }
}
