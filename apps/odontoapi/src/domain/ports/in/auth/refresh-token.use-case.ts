export const REFRESH_TOKEN_USE_CASE = Symbol('IRefreshTokenUseCase');

export interface RefreshTokenInput {
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenUseCase {
  execute(input: RefreshTokenInput): Promise<RefreshTokenOutput>;
}
