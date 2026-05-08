import { Inject, Injectable } from '@nestjs/common';
import type {
  IListPlansUseCase,
  ListPlansInput,
  ListPlansOutput,
} from '../../../domain/ports/in/plan/list-plans.use-case';
import { PLAN_REPOSITORY, type IPlanRepository } from '../../../domain/ports/out/plan.repository';

@Injectable()
export class ListPlansUseCase implements IListPlansUseCase {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository
  ) {}

  async execute(input: ListPlansInput): Promise<ListPlansOutput> {
    const { items, total } = await this.planRepository.findAll(input.page, input.limit);
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
