import { ListPlansUseCase } from './list-plans.use-case';
import type { IPlanRepository } from '../../../domain/ports/out/plan.repository';
import type { Plan } from '../../../domain/entities/plan.entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeDecimal = (value: string): any => ({
  toString: () => value,
  toNumber: () => Number(value),
});

const makePlanRepository = (): jest.Mocked<IPlanRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makePlan = (overrides: Partial<Plan> = {}): Plan => ({
  id: 'plan-1',
  name: 'Plano Básico',
  description: null,
  price: makeDecimal('99.90'),
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('ListPlansUseCase', () => {
  let useCase: ListPlansUseCase;
  let planRepository: jest.Mocked<IPlanRepository>;

  beforeEach(() => {
    planRepository = makePlanRepository();
    useCase = new ListPlansUseCase(planRepository);
  });

  it('retorna página de planos', async () => {
    const plans = [makePlan(), makePlan({ id: 'plan-2', name: 'Plano Premium' })];
    planRepository.findAll.mockResolvedValue({ items: plans, total: 2 });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(result.items[0].price).toBe(99.9);
  });

  it('retorna lista vazia quando não há planos', async () => {
    planRepository.findAll.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
