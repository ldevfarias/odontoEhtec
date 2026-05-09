import type { Professional } from '../../../domain/entities/professional.entity';
import type { IProfessionalRepository } from '../../../domain/ports/out/professional.repository';
import { ListProfessionalsUseCase } from './list-professionals.use-case';

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

const makeProfessional = (overrides: Partial<Professional> = {}): Professional => ({
  id: 'professional-1',
  name: 'Dr. João',
  email: 'joao@clinica.com',
  cpf: '12345678901',
  phone: null,
  status: 'ACTIVE',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('ListProfessionalsUseCase', () => {
  let useCase: ListProfessionalsUseCase;
  let professionalRepository: jest.Mocked<IProfessionalRepository>;

  beforeEach(() => {
    professionalRepository = makeProfessionalRepository();
    useCase = new ListProfessionalsUseCase(professionalRepository);
  });

  it('retorna página de profissionais filtrados por clínica', async () => {
    const professionals = [makeProfessional(), makeProfessional({ id: 'professional-2' })];
    professionalRepository.findAllByClinic.mockResolvedValue({ items: professionals, total: 2 });

    const result = await useCase.execute({ clinicId: 'clinic-1', page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(professionalRepository.findAllByClinic).toHaveBeenCalledWith('clinic-1', 1, 10);
  });

  it('retorna lista vazia quando não há profissionais', async () => {
    professionalRepository.findAllByClinic.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ clinicId: 'clinic-1', page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
