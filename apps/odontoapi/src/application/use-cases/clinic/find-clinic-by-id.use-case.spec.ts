import { NotFoundException } from '@nestjs/common';
import { FindClinicByIdUseCase } from './find-clinic-by-id.use-case';
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

describe('FindClinicByIdUseCase', () => {
  let useCase: FindClinicByIdUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    clinicRepository = makeClinicRepository();
    useCase = new FindClinicByIdUseCase(clinicRepository);
  });

  it('retorna clínica quando encontrada', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());

    const result = await useCase.execute({ id: 'clinic-1' });

    expect(result.id).toBe('clinic-1');
    expect(result.name).toBe('Clínica Teste');
  });

  it('lança NotFoundException quando clínica não existe', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
