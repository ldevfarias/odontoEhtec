import type { RefreshToken } from '../../entities/refresh-token.entity';

export const REFRESH_TOKEN_REPOSITORY = Symbol('IRefreshTokenRepository');

export interface CreateRefreshTokenData {
  tokenHash: string;
  familyId: string;
  userId: string;
  userType: 'SUBSCRIBER' | 'PROFESSIONAL';
  clinicId?: string;
  expiresAt: Date;
}

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revokeByTokenHash(tokenHash: string): Promise<void>;
  revokeAllByFamilyId(familyId: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
