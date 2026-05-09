import { ListClinicsUseCase } from './list-clinics.use-case';
import type { IClinicRepository } from '../../../domain/ports/out/clinic.repository';
import type { Clinic } from '../../../domain/entities/clinic.entity';

const makeClinicRepository = (): jest.Mocked<IClinicRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByCnpj: jest.fn(),
  findAllBySubscriber: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const CLINIC_CNPJ = '12345678000199';
const SUBSCRIBER_ID = 'subscriber-1';

const makeClinic = (overrides: Partial<Clinic> = {}): Clinic => ({
  id: 'clinic-1',
  name: 'Clínica Teste',
  cnpj: CLINIC_CNPJ,
  phone: null,
  email: null,
  address: null,
  subscriberId: SUBSCRIBER_ID,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('ListClinicsUseCase', () => {
  let useCase: ListClinicsUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    clinicRepository = makeClinicRepository();
    useCase = new ListClinicsUseCase(clinicRepository);
  });

  it('retorna página de clínicas filtradas por assinante', async () => {
    const clinics = [makeClinic(), makeClinic({ id: 'clinic-2' })];
    clinicRepository.findAllBySubscriber.mockResolvedValue({ items: clinics, total: 2 });

    const result = await useCase.execute({ subscriberId: SUBSCRIBER_ID, page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(clinicRepository.findAllBySubscriber).toHaveBeenCalledWith(SUBSCRIBER_ID, 1, 10);
  });

  it('retorna lista vazia quando não há clínicas', async () => {
    clinicRepository.findAllBySubscriber.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ subscriberId: SUBSCRIBER_ID, page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
