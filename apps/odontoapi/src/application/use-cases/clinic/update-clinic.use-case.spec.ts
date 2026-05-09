import { NotFoundException } from '@nestjs/common';
import { UpdateClinicUseCase } from './update-clinic.use-case';
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
const CLINIC_NAME_UPDATED = 'Nova Clínica';

const makeClinic = (overrides: Partial<Clinic> = {}): Clinic => ({
  id: 'clinic-1',
  name: 'Clínica Teste',
  cnpj: CLINIC_CNPJ,
  phone: null,
  email: null,
  address: null,
  subscriberId: 'subscriber-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('UpdateClinicUseCase', () => {
  let useCase: UpdateClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    clinicRepository = makeClinicRepository();
    useCase = new UpdateClinicUseCase(clinicRepository);
  });

  it('atualiza clínica existente', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    clinicRepository.update.mockResolvedValue(makeClinic({ name: CLINIC_NAME_UPDATED }));

    const result = await useCase.execute({ id: 'clinic-1', name: CLINIC_NAME_UPDATED });

    expect(result.name).toBe(CLINIC_NAME_UPDATED);
    expect(clinicRepository.update).toHaveBeenCalledWith(
      'clinic-1',
      expect.objectContaining({ name: CLINIC_NAME_UPDATED })
    );
  });

  it('lança NotFoundException quando clínica não existe', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente', name: 'X' })).rejects.toThrow(
      NotFoundException
    );
  });
});
