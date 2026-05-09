export const ACCEPT_INVITE_USE_CASE = Symbol('IAcceptInviteUseCase');

export interface AcceptInviteInput {
  token: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AcceptInviteOutput {
  accessToken: string;
  refreshToken: string;
}

export interface IAcceptInviteUseCase {
  execute(input: AcceptInviteInput): Promise<AcceptInviteOutput>;
}
