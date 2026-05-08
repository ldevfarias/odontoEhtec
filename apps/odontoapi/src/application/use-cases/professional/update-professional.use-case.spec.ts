import { NotFoundException } from '@nestjs/common';
import { UpdateProfessionalUseCase } from './update-professional.use-case';
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

describe('UpdateProfessionalUseCase', () => {
  let useCase: UpdateProfessionalUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new UpdateProfessionalUseCase(professionalRepository);
  });

  it('atualiza profissional existente', async () => {
    professionalRepository.findById.mockResolvedValue(makeProfessional());
    professionalRepository.update.mockResolvedValue(
      makeProfessional({ name: 'Dr. João Silva', role: 'ADMIN' })
    );

    const result = await useCase.execute({
      id: 'professional-1',
      name: 'Dr. João Silva',
      role: 'ADMIN',
    });

    expect(result.name).toBe('Dr. João Silva');
    expect(result.role).toBe('ADMIN');
    expect(professionalRepository.update).toHaveBeenCalledWith(
      'professional-1',
      expect.objectContaining({ name: 'Dr. João Silva', role: 'ADMIN' })
    );
  });

  it('lança NotFoundException quando profissional não existe', async () => {
    professionalRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente', name: 'X' })).rejects.toThrow(
      NotFoundException
    );
  });
});
