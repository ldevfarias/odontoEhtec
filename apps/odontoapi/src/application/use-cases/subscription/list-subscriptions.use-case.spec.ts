import { ListSubscriptionsUseCase } from './list-subscriptions.use-case';
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

const SUBSCRIBER_ID = 'subscriber-1';
const PLAN_ID = 'plan-1';
const SUBSCRIPTION_STATUS_TRIAL = 'TRIAL';
const DATE_2026 = DATE_2026;

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

describe('ListSubscriptionsUseCase', () => {
  let useCase: ListSubscriptionsUseCase;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(() => {
    subscriptionRepository = makeSubscriptionRepository();
    useCase = new ListSubscriptionsUseCase(subscriptionRepository);
  });

  it('retorna página de assinaturas filtradas por assinante', async () => {
    const subscriptions = [makeSubscription(), makeSubscription({ id: 'subscription-2' })];
    subscriptionRepository.findAllBySubscriber.mockResolvedValue({
      items: subscriptions,
      total: 2,
    });

    const result = await useCase.execute({ subscriberId: SUBSCRIBER_ID, page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(subscriptionRepository.findAllBySubscriber).toHaveBeenCalledWith(SUBSCRIBER_ID, 1, 10);
  });

  it('retorna lista vazia quando não há assinaturas', async () => {
    subscriptionRepository.findAllBySubscriber.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ subscriberId: SUBSCRIBER_ID, page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
