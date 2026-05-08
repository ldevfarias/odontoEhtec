export const CHECK_HEALTH_USE_CASE = Symbol('ICheckHealthUseCase');

export interface CheckHealthOutput {
  status: 'ok' | 'degraded';
  checks: {
    app: 'ok';
    database: 'ok' | 'error';
  };
  timestamp: string;
  uptimeSeconds: number;
}

export interface ICheckHealthUseCase {
  execute(): Promise<CheckHealthOutput>;
}
