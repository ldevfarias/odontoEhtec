import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePatientUseCase } from './create-patient.use-case';
import type { IPatientRepository } from '../../../domain/ports/out/patient.repository';
import type { IClinicRepository } from '../../../domain/ports/out/clinic.repository';
import type { Patient } from '../../../domain/entities/patient.entity';
import type { Clinic } from '../../../domain/entities/clinic.entity';

const makePatientRepository = (): jest.Mocked<IPatientRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByCpfAndClinic: jest.fn(),
  findAllByClinic: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeClinicRepository = (): jest.Mocked<IClinicRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByCnpj: jest.fn(),
  findAllBySubscriber: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const PATIENT_CPF = '12345678901';
const CLINIC_ID = 'clinic-1';
const DATE_2026 = DATE_2026;

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'patient-1',
  name: 'Maria',
  cpf: PATIENT_CPF,
  birthDate: null,
  phone: null,
  email: null,
  clinicId: CLINIC_ID,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

const makeClinic = (overrides: Partial<Clinic> = {}): Clinic => ({
  id: 'clinic-1',
  name: 'Clínica Teste',
  cnpj: '12345678000199',
  phone: null,
  email: null,
  address: null,
  subscriberId: 'subscriber-1',
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

describe('CreatePatientUseCase', () => {
  let useCase: CreatePatientUseCase;
  let patientRepository: jest.Mocked<IPatientRepository>;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    patientRepository = makePatientRepository();
    clinicRepository = makeClinicRepository();
    useCase = new CreatePatientUseCase(patientRepository, clinicRepository);
  });

  it('cria paciente com dados válidos', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    patientRepository.findByCpfAndClinic.mockResolvedValue(null);
    patientRepository.create.mockResolvedValue(makePatient());

    const result = await useCase.execute({
      name: 'Maria',
      cpf: PATIENT_CPF,
      clinicId: CLINIC_ID,
    });

    expect(result.id).toBe('patient-1');
    expect(result.cpf).toBe(PATIENT_CPF);
    expect(patientRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundException quando clínica não encontrada', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ name: 'Maria', cpf: PATIENT_CPF, clinicId: 'inexistente' })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando CPF já cadastrado nesta clínica', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    patientRepository.findByCpfAndClinic.mockResolvedValue(makePatient());

    await expect(
      useCase.execute({ name: 'Outro', cpf: PATIENT_CPF, clinicId: CLINIC_ID })
    ).rejects.toThrow(ConflictException);
  });
});
