export const DATABASE_HEALTH_CHECKER = Symbol('IDatabaseHealthChecker');

export interface IDatabaseHealthChecker {
  isHealthy(): Promise<boolean>;
}
