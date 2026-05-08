import { describe, it, expect, jest } from '@jest/globals';

// Exemplo de teste unitário para um caso de uso da camada de application.
// Padrão: instanciar o use-case com repositórios mockados (Output Ports).

interface IExampleRepository {
  findById(id: string): Promise<{ id: string; name: string } | null>;
}

class GetExampleUseCase {
  constructor(private readonly repo: IExampleRepository) {}

  async execute(id: string) {
    const result = await this.repo.findById(id);
    if (!result) throw new Error('Not found');
    return result;
  }
}

describe('GetExampleUseCase', () => {
  it('returns entity when found', async () => {
    const mockRepo: IExampleRepository = {
      findById: jest
        .fn<IExampleRepository['findById']>()
        .mockResolvedValue({ id: '1', name: 'Test' }),
    };
    const useCase = new GetExampleUseCase(mockRepo);
    const result = await useCase.execute('1');
    expect(result.name).toBe('Test');
  });

  it('throws when entity is not found', async () => {
    const mockRepo: IExampleRepository = {
      findById: jest.fn<IExampleRepository['findById']>().mockResolvedValue(null),
    };
    const useCase = new GetExampleUseCase(mockRepo);
    await expect(useCase.execute('99')).rejects.toThrow('Not found');
  });
});
