import { NotFoundException } from '@nestjs/common';
import type { Professional } from '../../../domain/entities/professional.entity';
import type { IProfessionalRepository } from '../../../domain/ports/out/professional.repository';
import { UpdateProfessionalUseCase } from './update-professional.use-case';

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
const PROFESSIONAL_NAME_UPDATED = 'Dr. João Silva';

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

describe('UpdateProfessionalUseCase', () => {
  let useCase: UpdateProfessionalUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new UpdateProfessionalUseCase(professionalRepository);
  });

  it('atualiza profissional existente', async () => {
    professionalRepository.findById.mockResolvedValue(makeProfessional());
    professionalRepository.update.mockResolvedValue(makeProfessional({ name: PROFESSIONAL_NAME_UPDATED }));

    const result = await useCase.execute({
      id: PROFESSIONAL_ID,
      name: PROFESSIONAL_NAME_UPDATED,
    });

    expect(result.name).toBe(PROFESSIONAL_NAME_UPDATED);
    expect(professionalRepository.update).toHaveBeenCalledWith(
      PROFESSIONAL_ID,
      expect.objectContaining({ name: PROFESSIONAL_NAME_UPDATED })
    );
  });

  it('lança NotFoundException quando profissional não existe', async () => {
    professionalRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente', name: 'X' })).rejects.toThrow(
      NotFoundException
    );
  });
});
