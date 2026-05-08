import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionUseCase } from './create-subscription.use-case';
import type { ISubscriptionRepository } from '../../../domain/ports/out/subscription.repository';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import type { IPlanRepository } from '../../../domain/ports/out/plan.repository';
import type { Subscription } from '../../../domain/entities/subscription.entity';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import type { Plan } from '../../../domain/entities/plan.entity';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeDecimal = (value: string): any => ({
  toString: () => value,
  toNumber: () => Number(value),
});

const makeSubscriptionRepository = (): jest.Mocked<ISubscriptionRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findActiveBySubscriber: jest.fn(),
  findAllBySubscriber: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeSubscriberRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makePlanRepository = (): jest.Mocked<IPlanRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeSubscription = (overrides: Partial<Subscription> = {}): Subscription => ({
  id: 'subscription-1',
  subscriberId: 'subscriber-1',
  planId: 'plan-1',
  status: 'TRIAL',
  startDate: new Date('2026-01-01'),
  endDate: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

const makeSubscriber = (overrides: Partial<Subscriber> = {}): Subscriber => ({
  id: 'subscriber-1',
  name: 'João',
  email: 'joao@email.com',
  document: '12345678000',
  phone: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
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

describe('CreateSubscriptionUseCase', () => {
  let useCase: CreateSubscriptionUseCase;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;
  let subscriberRepository: jest.Mocked<ISubscriberRepository>;
  let planRepository: jest.Mocked<IPlanRepository>;

  beforeEach(() => {
    subscriptionRepository = makeSubscriptionRepository();
    subscriberRepository = makeSubscriberRepository();
    planRepository = makePlanRepository();
    useCase = new CreateSubscriptionUseCase(
      subscriptionRepository,
      subscriberRepository,
      planRepository
    );
  });

  it('cria assinatura com dados válidos', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    planRepository.findById.mockResolvedValue(makePlan());
    subscriptionRepository.findActiveBySubscriber.mockResolvedValue(null);
    subscriptionRepository.create.mockResolvedValue(makeSubscription());

    const result = await useCase.execute({
      subscriberId: 'subscriber-1',
      planId: 'plan-1',
      status: 'TRIAL',
      startDate: new Date('2026-01-01'),
    });

    expect(result.id).toBe('subscription-1');
    expect(result.status).toBe('TRIAL');
    expect(subscriptionRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundException quando assinante não encontrado', async () => {
    subscriberRepository.findById.mockResolvedValue(null);
    planRepository.findById.mockResolvedValue(makePlan());

    await expect(
      useCase.execute({
        subscriberId: 'x',
        planId: 'plan-1',
        status: 'TRIAL',
        startDate: new Date(),
      })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança NotFoundException quando plano não encontrado', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    planRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        subscriberId: 'subscriber-1',
        planId: 'x',
        status: 'TRIAL',
        startDate: new Date(),
      })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando assinante já possui assinatura ativa', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    planRepository.findById.mockResolvedValue(makePlan());
    subscriptionRepository.findActiveBySubscriber.mockResolvedValue(makeSubscription());

    await expect(
      useCase.execute({
        subscriberId: 'subscriber-1',
        planId: 'plan-1',
        status: 'TRIAL',
        startDate: new Date(),
      })
    ).rejects.toThrow(ConflictException);
  });
});
