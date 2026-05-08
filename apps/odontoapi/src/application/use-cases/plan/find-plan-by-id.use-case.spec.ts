import { NotFoundException } from '@nestjs/common';
import { FindPlanByIdUseCase } from './find-plan-by-id.use-case';
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

describe('FindPlanByIdUseCase', () => {
  let useCase: FindPlanByIdUseCase;
  let planRepository: jest.Mocked<IPlanRepository>;

  beforeEach(() => {
    planRepository = makePlanRepository();
    useCase = new FindPlanByIdUseCase(planRepository);
  });

  it('retorna plano quando encontrado', async () => {
    planRepository.findById.mockResolvedValue(makePlan());

    const result = await useCase.execute({ id: 'plan-1' });

    expect(result.id).toBe('plan-1');
    expect(result.price).toBe(99.9);
  });

  it('lança NotFoundException quando plano não existe', async () => {
    planRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
