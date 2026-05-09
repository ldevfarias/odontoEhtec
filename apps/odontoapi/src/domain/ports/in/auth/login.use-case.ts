export const LOGIN_USE_CASE = Symbol('ILoginUseCase');

export interface LoginInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  userType: 'SUBSCRIBER' | 'PROFESSIONAL';
  subscriberId: string;
  onboardingComplete: boolean;
}

export interface ILoginUseCase {
  execute(input: LoginInput): Promise<LoginOutput>;
}
