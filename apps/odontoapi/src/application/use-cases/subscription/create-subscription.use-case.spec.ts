import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Plan } from '../../../domain/entities/plan.entity';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import type { Subscription } from '../../../domain/entities/subscription.entity';
import type { IPlanRepository } from '../../../domain/ports/out/plan.repository';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import type { ISubscriptionRepository } from '../../../domain/ports/out/subscription.repository';
import { CreateSubscriptionUseCase } from './create-subscription.use-case';

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
  countClinics: jest.fn(),
});

const makePlanRepository = (): jest.Mocked<IPlanRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByName: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const PLAN_ID = 'plan-1';

const SUBSCRIPTION_STATUS_TRIAL = 'TRIAL';
const DATE_2026 = new Date('2026-01-01');

const makeSubscription = (overrides: Partial<Subscription> = {}): Subscription => ({
  id: 'subscription-1',
  subscriberId: SUBSCRIBER_ID,
  planId: PLAN_ID,
  status: SUBSCRIPTION_STATUS_TRIAL,
  startDate: DATE_2026,
  endDate: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

const SUBSCRIBER_ID = 'subscriber-1';
const SUBSCRIBER_EMAIL = 'joao@email.com';

const makeSubscriber = (overrides: Partial<Subscriber> = {}): Subscriber => ({
  id: SUBSCRIBER_ID,
  name: 'João',
  email: SUBSCRIBER_EMAIL,
  document: '12345678000',
  phone: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

const makePlan = (overrides: Partial<Plan> = {}): Plan => ({
  id: PLAN_ID,
  name: 'Plano Básico',
  description: null,
  price: makeDecimal('99.90'),
  isActive: true,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
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
      subscriberId: SUBSCRIBER_ID,
      planId: PLAN_ID,
      status: SUBSCRIPTION_STATUS_TRIAL,
      startDate: DATE_2026,
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
        planId: PLAN_ID,
        status: SUBSCRIPTION_STATUS_TRIAL,
        startDate: new Date(),
      })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança NotFoundException quando plano não encontrado', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    planRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        subscriberId: SUBSCRIBER_ID,
        planId: 'x',
        status: SUBSCRIPTION_STATUS_TRIAL,
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
        subscriberId: SUBSCRIBER_ID,
        planId: PLAN_ID,
        status: SUBSCRIPTION_STATUS_TRIAL,
        startDate: new Date(),
      })
    ).rejects.toThrow(ConflictException);
  });
});
