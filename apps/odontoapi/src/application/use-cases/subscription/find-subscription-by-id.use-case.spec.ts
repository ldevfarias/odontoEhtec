import { NotFoundException } from '@nestjs/common';
import { FindSubscriptionByIdUseCase } from './find-subscription-by-id.use-case';
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

describe('FindSubscriptionByIdUseCase', () => {
  let useCase: FindSubscriptionByIdUseCase;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(() => {
    subscriptionRepository = makeSubscriptionRepository();
    useCase = new FindSubscriptionByIdUseCase(subscriptionRepository);
  });

  it('retorna assinatura quando encontrada', async () => {
    subscriptionRepository.findById.mockResolvedValue(makeSubscription());

    const result = await useCase.execute({ id: 'subscription-1' });

    expect(result.id).toBe('subscription-1');
    expect(result.status).toBe('TRIAL');
  });

  it('lança NotFoundException quando assinatura não existe', async () => {
    subscriptionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
