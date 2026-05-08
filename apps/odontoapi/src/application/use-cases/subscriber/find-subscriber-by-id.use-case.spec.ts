import { NotFoundException } from '@nestjs/common';
import { FindSubscriberByIdUseCase } from './find-subscriber-by-id.use-case';
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

describe('FindSubscriberByIdUseCase', () => {
  let useCase: FindSubscriberByIdUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new FindSubscriberByIdUseCase(repository);
  });

  it('retorna assinante quando encontrado', async () => {
    const now = new Date();
    repository.findById.mockResolvedValue({
      id: 'sub_1',
      name: 'Clínica Dental',
      email: 'contato@clinica.com',
      document: '11222333000181',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    const result = await useCase.execute({ id: 'sub_1' });

    expect(result.id).toBe('sub_1');
    expect(result.name).toBe('Clínica Dental');
  });

  it('lança NotFoundException quando assinante não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(NotFoundException);
  });
});
