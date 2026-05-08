import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProfessionalUseCase } from './create-professional.use-case';
import type { IProfessionalRepository } from '../../../domain/ports/out/professional.repository';
import type { IClinicRepository } from '../../../domain/ports/out/clinic.repository';
import type { Professional } from '../../../domain/entities/professional.entity';
import type { Clinic } from '../../../domain/entities/clinic.entity';

const makeProfessionalRepository = (): jest.Mocked<IProfessionalRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
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

const makeProfessional = (overrides: Partial<Professional> = {}): Professional => ({
  id: 'professional-1',
  name: 'Dr. João',
  email: 'joao@clinica.com',
  cpf: '12345678901',
  phone: null,
  role: 'DENTIST',
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

describe('CreateProfessionalUseCase', () => {
  let useCase: CreateProfessionalUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    clinicRepository = makeClinicRepository();
    useCase = new CreateProfessionalUseCase(professionalRepository, clinicRepository);
  });

  it('cria profissional com dados válidos', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    professionalRepository.findByEmail.mockResolvedValue(null);
    professionalRepository.findByCpf.mockResolvedValue(null);
    professionalRepository.create.mockResolvedValue(makeProfessional());

    const result = await useCase.execute({
      name: 'Dr. João',
      email: 'joao@clinica.com',
      cpf: '12345678901',
      role: 'DENTIST',
      clinicId: 'clinic-1',
    });

    expect(result.id).toBe('professional-1');
    expect(result.role).toBe('DENTIST');
    expect(professionalRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança NotFoundException quando clínica não encontrada', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        name: 'Dr. João',
        email: 'joao@clinica.com',
        cpf: '12345678901',
        role: 'DENTIST',
        clinicId: 'x',
      })
    ).rejects.toThrow(NotFoundException);
  });

  it('lança ConflictException quando email já cadastrado', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    professionalRepository.findByEmail.mockResolvedValue(makeProfessional());
    professionalRepository.findByCpf.mockResolvedValue(null);

    await expect(
      useCase.execute({
        name: 'Outro',
        email: 'joao@clinica.com',
        cpf: '99999999901',
        role: 'DENTIST',
        clinicId: 'clinic-1',
      })
    ).rejects.toThrow(ConflictException);
  });

  it('lança ConflictException quando CPF já cadastrado', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    professionalRepository.findByEmail.mockResolvedValue(null);
    professionalRepository.findByCpf.mockResolvedValue(makeProfessional());

    await expect(
      useCase.execute({
        name: 'Outro',
        email: 'outro@clinica.com',
        cpf: '12345678901',
        role: 'DENTIST',
        clinicId: 'clinic-1',
      })
    ).rejects.toThrow(ConflictException);
  });
});
