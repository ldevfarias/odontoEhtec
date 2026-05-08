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
      cpf: '12345678901',
      clinicId: 'clinic-1',
    });

    expect(result.id).toBe('patient-1');
    expect(result.cpf).toBe('12345678901');
    expect(patientRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundException quando clínica não encontrada', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ name: 'Maria', cpf: '12345678901', clinicId: 'inexistente' })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando CPF já cadastrado nesta clínica', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    patientRepository.findByCpfAndClinic.mockResolvedValue(makePatient());

    await expect(
      useCase.execute({ name: 'Outro', cpf: '12345678901', clinicId: 'clinic-1' })
    ).rejects.toThrow(ConflictException);
  });
});
