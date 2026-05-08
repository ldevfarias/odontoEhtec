import { NotFoundException } from '@nestjs/common';
import { DeleteSubscriptionUseCase } from './delete-subscription.use-case';
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

describe('DeleteSubscriptionUseCase', () => {
  let useCase: DeleteSubscriptionUseCase;
  let subscriptionRepository: jest.Mocked<ISubscriptionRepository>;

  beforeEach(() => {
    subscriptionRepository = makeSubscriptionRepository();
    useCase = new DeleteSubscriptionUseCase(subscriptionRepository);
  });

  it('deleta assinatura existente', async () => {
    subscriptionRepository.findById.mockResolvedValue(makeSubscription());
    subscriptionRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'subscription-1' })).resolves.toBeUndefined();
    expect(subscriptionRepository.delete).toHaveBeenCalledWith('subscription-1');
  });

  it('lança NotFoundException quando assinatura não existe', async () => {
    subscriptionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
