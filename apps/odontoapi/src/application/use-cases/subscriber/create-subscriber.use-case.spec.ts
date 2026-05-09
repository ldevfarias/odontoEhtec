import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import { CreateSubscriberUseCase } from './create-subscriber.use-case';

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

const SUBSCRIBER_EMAIL = 'contato@clinica.com';
const SUBSCRIBER_DOCUMENT = '11222333000181';
const CLINIC_DENTAL = CLINIC_DENTAL;

describe('CreateSubscriberUseCase', () => {
  let useCase: CreateSubscriberUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new CreateSubscriberUseCase(repository);
  });

  it('cria assinante com dados válidos', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: 'sub_1',
      name: CLINIC_DENTAL,
      email: SUBSCRIBER_EMAIL,
      document: SUBSCRIBER_DOCUMENT,
      phone: '11999999999',
      createdAt: now,
      updatedAt: now,
    });

    const result = await useCase.execute({
      name: CLINIC_DENTAL,
      email: SUBSCRIBER_EMAIL,
      document: '11.222.333/0001-81',
      phone: '11999999999',
    });

    expect(result.id).toBe('sub_1');
    expect(result.email).toBe(SUBSCRIBER_EMAIL);
    expect(repository.create).toHaveBeenCalledWith({
      name: CLINIC_DENTAL,
      email: SUBSCRIBER_EMAIL,
      document: SUBSCRIBER_DOCUMENT,
      phone: '11999999999',
    });
  });

  it('normaliza email para minúsculas antes de criar', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: 'sub_2',
      name: 'Clínica',
      email: SUBSCRIBER_EMAIL,
      document: SUBSCRIBER_DOCUMENT,
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    await useCase.execute({
      name: 'Clínica',
      email: 'CONTATO@CLINICA.COM',
      document: SUBSCRIBER_DOCUMENT,
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: SUBSCRIBER_EMAIL })
    );
  });

  it('lança ConflictException quando email já cadastrado', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue({
      id: 'existing',
      name: 'Outro',
      email: SUBSCRIBER_EMAIL,
      document: '99',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      useCase.execute({ name: 'Nova', email: SUBSCRIBER_EMAIL, document: '22333444000192' })
    ).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('lança ConflictException quando documento já cadastrado', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue({
      id: 'existing',
      name: 'Outro',
      email: 'outro@clinica.com',
      document: SUBSCRIBER_DOCUMENT,
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      useCase.execute({ name: 'Nova', email: 'nova@clinica.com', document: SUBSCRIBER_DOCUMENT })
    ).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
