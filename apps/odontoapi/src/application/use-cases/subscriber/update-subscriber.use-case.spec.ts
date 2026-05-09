import { NotFoundException } from '@nestjs/common';
import { UpdateSubscriberUseCase } from './update-subscriber.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  countClinics: jest.fn(),
});

describe('UpdateSubscriberUseCase', () => {
  let useCase: UpdateSubscriberUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new UpdateSubscriberUseCase(repository);
  });

  it('atualiza assinante existente', async () => {
    const now = new Date();
    const existing = {
      id: 'sub_1',
      name: 'Antigo',
      email: 'a@a.com',
      document: '1',
      phone: null,
      createdAt: now,
      updatedAt: now,
    };
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue({ ...existing, name: 'Novo Nome' });

    const result = await useCase.execute({ id: 'sub_1', name: 'Novo Nome' });

    expect(result.name).toBe('Novo Nome');
    expect(repository.update).toHaveBeenCalledWith('sub_1', {
      name: 'Novo Nome',
      phone: undefined,
    });
  });

  it('lança NotFoundException quando assinante não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'x', name: 'Nome' })).rejects.toThrow(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
