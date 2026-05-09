import { ConflictException } from '@nestjs/common';
import type { Professional } from '../../../domain/entities/professional.entity';
import type { IProfessionalRepository } from '../../../domain/ports/out/professional.repository';
import { CreateProfessionalUseCase } from './create-professional.use-case';

const makeProfessionalRepository = (): jest.Mocked<IProfessionalRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  findAllByClinic: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  upsertForInvite: jest.fn(),
  getFirstClinicId: jest.fn(),
});

const PROFESSIONAL_EMAIL = 'joao@clinica.com';
const PROFESSIONAL_CPF = '12345678901';

const makeProfessional = (overrides: Partial<Professional> = {}): Professional => ({
  id: 'professional-1',
  name: 'Dr. João',
  email: PROFESSIONAL_EMAIL,
  cpf: PROFESSIONAL_CPF,
  phone: null,
  status: 'INVITED',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('CreateProfessionalUseCase', () => {
  let useCase: CreateProfessionalUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new CreateProfessionalUseCase(professionalRepository);
  });

  it('cria profissional com dados válidos', async () => {
    professionalRepository.findByEmail.mockResolvedValue(null);
    professionalRepository.findByCpf.mockResolvedValue(null);
    professionalRepository.create.mockResolvedValue(makeProfessional());

    const result = await useCase.execute({
      name: 'Dr. João',
      email: PROFESSIONAL_EMAIL,
      cpf: PROFESSIONAL_CPF,
    });

    expect(result.id).toBe('professional-1');
    expect(result.status).toBe('INVITED');
    expect(professionalRepository.create).toHaveBeenCalledTimes(1);
  });

  it('lança ConflictException quando email já cadastrado', async () => {
    professionalRepository.findByEmail.mockResolvedValue(makeProfessional());
    professionalRepository.findByCpf.mockResolvedValue(null);

    await expect(
      useCase.execute({
        name: 'Outro',
        email: PROFESSIONAL_EMAIL,
        cpf: '99999999901',
      })
    ).rejects.toThrow(ConflictException);
  });

  it('lança ConflictException quando CPF já cadastrado', async () => {
    professionalRepository.findByEmail.mockResolvedValue(null);
    professionalRepository.findByCpf.mockResolvedValue(makeProfessional());

    await expect(
      useCase.execute({
        name: 'Outro',
        email: 'outro@clinica.com',
        cpf: PROFESSIONAL_CPF,
      })
    ).rejects.toThrow(ConflictException);
  });
});
