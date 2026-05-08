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

    const result = await useCase.execute({ subscriberId: 'subscriber-1', page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(subscriptionRepository.findAllBySubscriber).toHaveBeenCalledWith('subscriber-1', 1, 10);
  });

  it('retorna lista vazia quando não há assinaturas', async () => {
    subscriptionRepository.findAllBySubscriber.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ subscriberId: 'subscriber-1', page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
