export const RESET_PASSWORD_USE_CASE = Symbol('IResetPasswordUseCase');

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface IResetPasswordUseCase {
  execute(input: ResetPasswordInput): Promise<void>;
}
