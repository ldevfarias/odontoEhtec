export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol('IPasswordResetTokenRepository');

export interface CreatePasswordResetTokenData {
  tokenHash: string;
  email: string;
  expiresAt: Date;
}

export interface IPasswordResetTokenRepository {
  create(data: CreatePasswordResetTokenData): Promise<void>;
  findByTokenHash(
    tokenHash: string
  ): Promise<{ email: string; expiresAt: Date; usedAt: Date | null } | null>;
  markAsUsed(tokenHash: string): Promise<void>;
  revokeAllByEmail(email: string): Promise<void>;
}
