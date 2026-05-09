import { NotFoundException } from '@nestjs/common';
import { UpdatePatientUseCase } from './update-patient.use-case';
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

const PATIENT_CPF = '12345678901';
const PATIENT_NAME_UPDATED = 'Maria Silva';

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'patient-1',
  name: 'Maria',
  cpf: PATIENT_CPF,
  birthDate: null,
  phone: null,
  email: null,
  clinicId: 'clinic-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('UpdatePatientUseCase', () => {
  let useCase: UpdatePatientUseCase;
  let patientRepository: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    patientRepository = makePatientRepository();
    useCase = new UpdatePatientUseCase(patientRepository);
  });

  it('atualiza paciente existente', async () => {
    patientRepository.findById.mockResolvedValue(makePatient());
    patientRepository.update.mockResolvedValue(makePatient({ name: PATIENT_NAME_UPDATED }));

    const result = await useCase.execute({ id: 'patient-1', name: PATIENT_NAME_UPDATED });

    expect(result.name).toBe(PATIENT_NAME_UPDATED);
    expect(patientRepository.update).toHaveBeenCalledWith(
      'patient-1',
      expect.objectContaining({ name: PATIENT_NAME_UPDATED })
    );
  });

  it('lança NotFoundException quando paciente não existe', async () => {
    patientRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente', name: 'X' })).rejects.toThrow(
      NotFoundException
    );
  });
});
