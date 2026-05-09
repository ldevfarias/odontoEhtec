import { NotFoundException } from '@nestjs/common';
import type { Professional } from '../../../domain/entities/professional.entity';
import type { IProfessionalRepository } from '../../../domain/ports/out/professional.repository';
import { FindProfessionalByIdUseCase } from './find-professional-by-id.use-case';

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
const PROFESSIONAL_ID = 'professional-1';

const makeProfessional = (overrides: Partial<Professional> = {}): Professional => ({
  id: PROFESSIONAL_ID,
  name: 'Dr. João',
  email: PROFESSIONAL_EMAIL,
  cpf: '12345678901',
  phone: null,
  status: 'ACTIVE',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('FindProfessionalByIdUseCase', () => {
  let useCase: FindProfessionalByIdUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new FindProfessionalByIdUseCase(professionalRepository);
  });

  it('retorna profissional quando encontrado', async () => {
    professionalRepository.findById.mockResolvedValue(makeProfessional());

    const result = await useCase.execute({ id: PROFESSIONAL_ID });

    expect(result.id).toBe(PROFESSIONAL_ID);
    expect(result.status).toBe('ACTIVE');
  });

  it('lança NotFoundException quando profissional não existe', async () => {
    professionalRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
