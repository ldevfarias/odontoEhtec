import { ListSubscribersUseCase } from './list-subscribers.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ListSubscribersUseCase', () => {
  let useCase: ListSubscribersUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new ListSubscribersUseCase(repository);
  });

  it('retorna página de assinantes com totalPages calculado', async () => {
    const now = new Date();
    repository.findAll.mockResolvedValue({
      items: [
        {
          id: 's1',
          name: 'A',
          email: 'a@a.com',
          document: '1',
          phone: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 's2',
          name: 'B',
          email: 'b@b.com',
          document: '2',
          phone: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      total: 25,
    });

    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(2);
    expect(repository.findAll).toHaveBeenCalledWith(2, 10);
  });

  it('retorna lista vazia quando não há assinantes', async () => {
    repository.findAll.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
