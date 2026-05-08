import { NotFoundException } from '@nestjs/common';
import { DeleteSubscriberUseCase } from './delete-subscriber.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DeleteSubscriberUseCase', () => {
  let useCase: DeleteSubscriberUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new DeleteSubscriberUseCase(repository);
  });

  it('deleta assinante existente', async () => {
    const now = new Date();
    repository.findById.mockResolvedValue({
      id: 'sub_1',
      name: 'A',
      email: 'a@a.com',
      document: '1',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });
    repository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'sub_1' })).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('sub_1');
  });

  it('lança NotFoundException quando assinante não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
