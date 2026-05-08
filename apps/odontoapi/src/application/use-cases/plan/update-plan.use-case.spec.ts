import { NotFoundException } from '@nestjs/common';
import { UpdatePlanUseCase } from './update-plan.use-case';
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

describe('UpdatePlanUseCase', () => {
  let useCase: UpdatePlanUseCase;
  let planRepository: jest.Mocked<IPlanRepository>;

  beforeEach(() => {
    planRepository = makePlanRepository();
    useCase = new UpdatePlanUseCase(planRepository);
  });

  it('atualiza plano existente', async () => {
    planRepository.findById.mockResolvedValue(makePlan());
    planRepository.update.mockResolvedValue(
      makePlan({ name: 'Plano Premium', price: makeDecimal('199.90') })
    );

    const result = await useCase.execute({ id: 'plan-1', name: 'Plano Premium', price: 199.9 });

    expect(result.name).toBe('Plano Premium');
    expect(result.price).toBe(199.9);
  });

  it('lança NotFoundException quando plano não existe', async () => {
    planRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente', name: 'X' })).rejects.toThrow(
      NotFoundException
    );
  });
});
