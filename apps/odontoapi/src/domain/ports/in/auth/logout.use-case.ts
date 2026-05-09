export const LOGOUT_USE_CASE = Symbol('ILogoutUseCase');

export interface LogoutInput {
  refreshToken: string;
  userId: string;
  userType: 'SUBSCRIBER' | 'PROFESSIONAL';
  subscriberId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ILogoutUseCase {
  execute(input: LogoutInput): Promise<void>;
}
