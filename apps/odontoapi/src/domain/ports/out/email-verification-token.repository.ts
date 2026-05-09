export const EMAIL_VERIFICATION_TOKEN_REPOSITORY = Symbol('IEmailVerificationTokenRepository');

export interface CreateEmailVerificationTokenData {
  tokenHash: string;
  email: string;
  expiresAt: Date;
}

export interface IEmailVerificationTokenRepository {
  create(data: CreateEmailVerificationTokenData): Promise<void>;
  findByTokenHash(
    tokenHash: string
  ): Promise<{ email: string; expiresAt: Date; usedAt: Date | null } | null>;
  markAsUsed(tokenHash: string): Promise<void>;
}
