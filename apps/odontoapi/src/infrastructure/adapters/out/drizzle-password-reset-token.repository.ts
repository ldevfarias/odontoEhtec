import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import type {
  CreatePasswordResetTokenData,
  IPasswordResetTokenRepository,
} from '../../../domain/ports/out/password-reset-token.repository';
import { passwordResetTokens } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzlePasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreatePasswordResetTokenData): Promise<void> {
    await this.drizzle.db.insert(passwordResetTokens).values(data);
  }

  async findByTokenHash(
    tokenHash: string
  ): Promise<{ email: string; expiresAt: Date; usedAt: Date | null } | null> {
    const [row] = await this.drizzle.db
      .select({
        email: passwordResetTokens.email,
        expiresAt: passwordResetTokens.expiresAt,
        usedAt: passwordResetTokens.usedAt,
      })
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.tokenHash, tokenHash))
      .limit(1);
    return row ?? null;
  }

  async markAsUsed(tokenHash: string): Promise<void> {
    await this.drizzle.db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.tokenHash, tokenHash));
  }

  async revokeAllByEmail(email: string): Promise<void> {
    await this.drizzle.db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(passwordResetTokens.email, email), isNull(passwordResetTokens.usedAt)));
  }
}
