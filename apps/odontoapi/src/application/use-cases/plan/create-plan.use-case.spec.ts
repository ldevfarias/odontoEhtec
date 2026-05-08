import { ConflictException } from '@nestjs/common';
import { CreatePlanUseCase } from './create-plan.use-case';
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

describe('CreatePlanUseCase', () => {
  let useCase: CreatePlanUseCase;
  let planRepository: jest.Mocked<IPlanRepository>;

  beforeEach(() => {
    planRepository = makePlanRepository();
    useCase = new CreatePlanUseCase(planRepository);
  });

  it('cria plano com dados válidos', async () => {
    planRepository.findByName.mockResolvedValue(null);
    planRepository.create.mockResolvedValue(makePlan());

    const result = await useCase.execute({ name: 'Plano Básico', price: 99.9 });

    expect(result.id).toBe('plan-1');
    expect(result.price).toBe(99.9);
    expect(typeof result.price).toBe('number');
    expect(planRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança ConflictException quando nome já cadastrado', async () => {
    planRepository.findByName.mockResolvedValue(makePlan());

    await expect(useCase.execute({ name: 'Plano Básico', price: 99.9 })).rejects.toThrow(
      ConflictException
    );
  });
});
