export const FORGOT_PASSWORD_USE_CASE = Symbol('IForgotPasswordUseCase');

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordOutput {
  message: string;
}

export interface IForgotPasswordUseCase {
  execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput>;
}
