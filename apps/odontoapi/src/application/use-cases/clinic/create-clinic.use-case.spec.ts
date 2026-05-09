import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Clinic } from '../../../domain/entities/clinic.entity';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import type { IClinicRepository } from '../../../domain/ports/out/clinic.repository';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import { CreateClinicUseCase } from './create-clinic.use-case';

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
  countClinics: jest.fn(),
});

const CLINIC_NAME = 'Clínica Teste';
const CLINIC_CNPJ = '12345678000199';
const SUBSCRIBER_ID = 'subscriber-1';

const DATE_2026 = new Date('2026-01-01');

const makeClinic = (overrides: Partial<Clinic> = {}): Clinic => ({
  id: 'clinic-1',
  name: CLINIC_NAME,
  cnpj: CLINIC_CNPJ,
  phone: null,
  email: null,
  address: null,
  subscriberId: SUBSCRIBER_ID,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

const makeSubscriber = (overrides: Partial<Subscriber> = {}): Subscriber => ({
  id: SUBSCRIBER_ID,
  name: 'João',
  email: 'joao@email.com',
  document: '12345678000',
  phone: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
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
      name: CLINIC_NAME,
      cnpj: CLINIC_CNPJ,
      subscriberId: SUBSCRIBER_ID,
    });

    expect(result.id).toBe('clinic-1');
    expect(result.cnpj).toBe(CLINIC_CNPJ);
    expect(clinicRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundException quando assinante não encontrado', async () => {
    subscriberRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ name: CLINIC_NAME, cnpj: CLINIC_CNPJ, subscriberId: 'x' })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando CNPJ já cadastrado', async () => {
    subscriberRepository.findById.mockResolvedValue(makeSubscriber());
    clinicRepository.findByCnpj.mockResolvedValue(makeClinic());

    await expect(
      useCase.execute({
        name: 'Outra Clínica',
        cnpj: CLINIC_CNPJ,
        subscriberId: SUBSCRIBER_ID,
      })
    ).rejects.toThrow(ConflictException);
  });
});
