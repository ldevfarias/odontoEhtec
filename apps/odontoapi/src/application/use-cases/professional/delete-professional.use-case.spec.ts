import { NotFoundException } from '@nestjs/common';
import { DeleteProfessionalUseCase } from './delete-professional.use-case';
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

describe('DeleteProfessionalUseCase', () => {
  let useCase: DeleteProfessionalUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new DeleteProfessionalUseCase(professionalRepository);
  });

  it('deleta profissional existente', async () => {
    professionalRepository.findById.mockResolvedValue(makeProfessional());
    professionalRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'professional-1' })).resolves.toBeUndefined();
    expect(professionalRepository.delete).toHaveBeenCalledWith('professional-1');
  });

  it('lança NotFoundException quando profissional não existe', async () => {
    professionalRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
