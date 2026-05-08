import { CheckHealthUseCase } from './check-health.use-case';
import type { IDatabaseHealthChecker } from '../../../domain/ports/out/database-health-checker.port';

const makeDatabaseHealthChecker = (): jest.Mocked<IDatabaseHealthChecker> => ({
  isHealthy: jest.fn(),
});

describe('CheckHealthUseCase', () => {
  it('retorna status ok quando banco esta saudavel', async () => {
    const databaseHealthChecker = makeDatabaseHealthChecker();
    databaseHealthChecker.isHealthy.mockResolvedValue(true);
    const useCase = new CheckHealthUseCase(databaseHealthChecker);

    const output = await useCase.execute();

    expect(output.status).toBe('ok');
    expect(output.checks.app).toBe('ok');
    expect(output.checks.database).toBe('ok');
    expect(output.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('retorna status degraded quando banco nao esta saudavel', async () => {
    const databaseHealthChecker = makeDatabaseHealthChecker();
    databaseHealthChecker.isHealthy.mockResolvedValue(false);
    const useCase = new CheckHealthUseCase(databaseHealthChecker);

    const output = await useCase.execute();

    expect(output.status).toBe('degraded');
    expect(output.checks.database).toBe('error');
  });
});
