import { NotFoundException } from '@nestjs/common';
import { FindProfessionalByIdUseCase } from './find-professional-by-id.use-case';
import type { IProfessionalRepository } from '../../../domain/ports/out/professional.repository';
import type { Professional } from '../../../domain/entities/professional.entity';

const makeProfessionalRepository = (): jest.Mocked<IProfessionalRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByCpf: jest.fn(),
  findAllByClinic: jest.fn(),
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

describe('FindProfessionalByIdUseCase', () => {
  let useCase: FindProfessionalByIdUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new FindProfessionalByIdUseCase(professionalRepository);
  });

  it('retorna profissional quando encontrado', async () => {
    professionalRepository.findById.mockResolvedValue(makeProfessional());

    const result = await useCase.execute({ id: 'professional-1' });

    expect(result.id).toBe('professional-1');
    expect(result.role).toBe('DENTIST');
  });

  it('lança NotFoundException quando profissional não existe', async () => {
    professionalRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
