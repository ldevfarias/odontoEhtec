import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateClinicUseCase } from './create-clinic.use-case';
import type { IClinicRepository } from '../../../domain/ports/out/clinic.repository';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import type { Clinic } from '../../../domain/entities/clinic.entity';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';

const makeClinicRepository = (): jest.Mocked<IClinicRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByCnpj: jest.fn(),
  findAllBySubscriber: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeSubscriberRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeClinic = (overrides: Partial<Clinic> = {}): Clinic => ({
  id: 'clinic-1',
  name: 'Clínica Teste',
  cnpj: '12345678000199',
  phone: null,
  email: null,
  address: null,
  subscriberId: 'subscriber-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

const makeSubscriber = (overrides: Partial<Subscriber> = {}): Subscriber => ({
  id: 'subscriber-1',
  name: 'João',
  email: 'joao@email.com',
  document: '12345678000',
  phone: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('CreateClinicUseCase', () => {
  let useCase: CreateClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;
  let subscriberRepository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    clinicRepository = makeClinicRepository();
    subscriberRepository = makeSubscriberRepository();
    useCase = new CreateClinicUseCase(clinicRepository, subscriberRepository);
  });

  it('cria clínica com dados válidos', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    clinicRepository.findByCnpj.mockResolvedValue(null);
    clinicRepository.create.mockResolvedValue(makeClinic());

    const result = await useCase.execute({
      name: 'Clínica Teste',
      cnpj: '12345678000199',
      subscriberId: 'subscriber-1',
    });

    expect(result.id).toBe('clinic-1');
    expect(result.cnpj).toBe('12345678000199');
    expect(clinicRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundException quando assinante não encontrado', async () => {
    subscriberRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ name: 'Clínica Teste', cnpj: '12345678000199', subscriberId: 'x' })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando CNPJ já cadastrado', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    clinicRepository.findByCnpj.mockResolvedValue(makeClinic());

    await expect(
      useCase.execute({
        name: 'Outra Clínica',
        cnpj: '12345678000199',
        subscriberId: 'subscriber-1',
      })
    ).rejects.toThrow(ConflictException);
  });
});
