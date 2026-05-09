import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type {
  CreateEmailVerificationTokenData,
  IEmailVerificationTokenRepository,
} from '../../../domain/ports/out/email-verification-token.repository';
import { emailVerificationTokens } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleEmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateEmailVerificationTokenData): Promise<void> {
    await this.drizzle.db.insert(emailVerificationTokens).values(data);
  }

  async findByTokenHash(
    tokenHash: string
  ): Promise<{ email: string; expiresAt: Date; usedAt: Date | null } | null> {
    const [row] = await this.drizzle.db
      .select({
        email: emailVerificationTokens.email,
        expiresAt: emailVerificationTokens.expiresAt,
        usedAt: emailVerificationTokens.usedAt,
      })
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.tokenHash, tokenHash))
      .limit(1);
    return row ?? null;
  }

  async markAsUsed(tokenHash: string): Promise<void> {
    await this.drizzle.db
      .update(emailVerificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(emailVerificationTokens.tokenHash, tokenHash));
  }
}
