import { NotFoundException } from '@nestjs/common';
import { FindPatientByIdUseCase } from './find-patient-by-id.use-case';
import type { IPatientRepository } from '../../../domain/ports/out/patient.repository';
import type { Patient } from '../../../domain/entities/patient.entity';

const makePatientRepository = (): jest.Mocked<IPatientRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByCpfAndClinic: jest.fn(),
  findAllByClinic: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'patient-1',
  name: 'Maria',
  cpf: '12345678901',
  birthDate: null,
  phone: null,
  email: null,
  clinicId: 'clinic-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('FindPatientByIdUseCase', () => {
  let useCase: FindPatientByIdUseCase;
  let patientRepository: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    patientRepository = makePatientRepository();
    useCase = new FindPatientByIdUseCase(patientRepository);
  });

  it('retorna paciente quando encontrado', async () => {
    patientRepository.findById.mockResolvedValue(makePatient());

    const result = await useCase.execute({ id: 'patient-1' });

    expect(result.id).toBe('patient-1');
    expect(result.name).toBe('Maria');
  });

  it('lança NotFoundException quando paciente não existe', async () => {
    patientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
