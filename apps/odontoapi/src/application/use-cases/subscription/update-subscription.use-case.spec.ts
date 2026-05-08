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

    const result = await useCase.execute({ id: 'subscription-1', status: 'ACTIVE' });

    expect(result.status).toBe('ACTIVE');
    expect(subscriptionRepository.update).toHaveBeenCalledWith(
      'subscription-1',
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
