export const VERIFY_EMAIL_USE_CASE = Symbol('IVerifyEmailUseCase');

export interface VerifyEmailInput {
  token: string;
}

export interface AuthTokensOutput {
  subscriberId: string | null;
  professionalId: string | null;
  userType: 'SUBSCRIBER' | 'PROFESSIONAL';
}

export interface IVerifyEmailUseCase {
  execute(input: VerifyEmailInput): Promise<AuthTokensOutput>;
}
