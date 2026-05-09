import { NotFoundException } from '@nestjs/common';
import { UpdateSubscriptionUseCase } from './update-subscription.use-case';
import type { ISubscriptionRepository } from '../../../domain/ports/out/subscription.repository';
import type { Subscription } from '../../../domain/entities/subscription.entity';

const makeSubscriptionRepository = (): jest.Mocked<ISubscriptionRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findActiveBySubscriber: jest.fn(),
  findAllBySubscriber: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const SUBSCRIPTION_ID = 'subscription-1';
const SUBSCRIBER_ID = 'subscriber-1';
const PLAN_ID = 'plan-1';
const SUBSCRIPTION_STATUS_TRIAL = 'TRIAL';
const DATE_2026 = new Date('2026-01-01');

const makeSubscription = (overrides: Partial<Subscription> = {}): Subscription => ({
  id: SUBSCRIPTION_ID,
  subscriberId: SUBSCRIBER_ID,
  planId: PLAN_ID,
  status: SUBSCRIPTION_STATUS_TRIAL,
  startDate: DATE_2026,
  endDate: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

describe('UpdateSubscriptionUseCase', () => {
  let useCase: UpdateSubscriptionUseCase;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(() => {
    subscriptionRepository = makeSubscriptionRepository();
    useCase = new UpdateSubscriptionUseCase(subscriptionRepository);
  });

  it('atualiza assinatura existente', async () => {
    subscriptionRepository.findById.mockResolvedValue(makeSubscription());
    subscriptionRepository.update.mockResolvedValue(makeSubscription({ status: 'ACTIVE' }));

    const result = await useCase.execute({ id: SUBSCRIPTION_ID, status: 'ACTIVE' });

    expect(result.status).toBe('ACTIVE');
    expect(subscriptionRepository.update).toHaveBeenCalledWith(
      SUBSCRIPTION_ID,
      expect.objectContaining({ status: 'ACTIVE' })
    );
  });

  it('lança NotFoundException quando assinatura não existe', async () => {
    subscriptionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente', status: 'ACTIVE' })).rejects.toThrow(
      NotFoundException
    );
  });
});
