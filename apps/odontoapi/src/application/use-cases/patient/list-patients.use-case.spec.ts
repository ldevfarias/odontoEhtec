import { ListPatientsUseCase } from './list-patients.use-case';
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

describe('ListPatientsUseCase', () => {
  let useCase: ListPatientsUseCase;
  let patientRepository: jest.Mocked<IPatientRepository>;

  beforeEach(() => {
    patientRepository = makePatientRepository();
    useCase = new ListPatientsUseCase(patientRepository);
  });

  it('retorna página de pacientes filtrados por clínica', async () => {
    const patients = [makePatient(), makePatient({ id: 'patient-2' })];
    patientRepository.findAllByClinic.mockResolvedValue({ items: patients, total: 2 });

    const result = await useCase.execute({ clinicId: 'clinic-1', page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(patientRepository.findAllByClinic).toHaveBeenCalledWith('clinic-1', 1, 10);
  });

  it('retorna lista vazia quando não há pacientes', async () => {
    patientRepository.findAllByClinic.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ clinicId: 'clinic-1', page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
