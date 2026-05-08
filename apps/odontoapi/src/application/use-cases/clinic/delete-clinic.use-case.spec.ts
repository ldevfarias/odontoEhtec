import { NotFoundException } from '@nestjs/common';
import { DeleteClinicUseCase } from './delete-clinic.use-case';
import type { IClinicRepository } from '../../../domain/ports/out/clinic.repository';
import type { Clinic } from '../../../domain/entities/clinic.entity';

const makeClinicRepository = (): jest.Mocked<IClinicRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByCnpj: jest.fn(),
  findAllBySubscriber: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

describe('DeleteClinicUseCase', () => {
  let useCase: DeleteClinicUseCase;
  let clinicRepository: jest.Mocked<IClinicRepository>;

  beforeEach(() => {
    clinicRepository = makeClinicRepository();
    useCase = new DeleteClinicUseCase(clinicRepository);
  });

  it('deleta clínica existente', async () => {
    clinicRepository.findById.mockResolvedValue(makeClinic());
    clinicRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'clinic-1' })).resolves.toBeUndefined();
    expect(clinicRepository.delete).toHaveBeenCalledWith('clinic-1');
  });

  it('lança NotFoundException quando clínica não existe', async () => {
    clinicRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'inexistente' })).rejects.toThrow(NotFoundException);
  });
});
