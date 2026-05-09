export const VALIDATE_INVITE_TOKEN_USE_CASE = Symbol('IValidateInviteTokenUseCase');

export interface ValidateInviteTokenInput {
  token: string;
}

export interface ValidateInviteTokenOutput {
  professionalId: string;
  professionalName: string;
  email: string;
}

export interface IValidateInviteTokenUseCase {
  execute(input: ValidateInviteTokenInput): Promise<ValidateInviteTokenOutput>;
}
