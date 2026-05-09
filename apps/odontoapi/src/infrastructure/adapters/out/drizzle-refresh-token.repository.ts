import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import type {
  CreateRefreshTokenData,
  IRefreshTokenRepository,
} from '../../../domain/ports/out/refresh-token.repository';
import { refreshTokens } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const [row] = await this.drizzle.db
      .insert(refreshTokens)
      .values({
        tokenHash: data.tokenHash,
        familyId: data.familyId,
        userId: data.userId,
        userType: data.userType,
        clinicId: data.clinicId ?? null,
        expiresAt: data.expiresAt,
      })
      .returning();
    return this.mapToDomain(row);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);
    return row ? this.mapToDomain(row) : null;
  }

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    await this.drizzle.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)));
  }

  async revokeAllByFamilyId(familyId: string): Promise<void> {
    await this.drizzle.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.familyId, familyId), isNull(refreshTokens.revokedAt)));
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.drizzle.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
  }

  private mapToDomain(record: {
    id: string;
    tokenHash: string;
    familyId: string;
    userId: string;
    userType: string;
    clinicId: string | null;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
  }): RefreshToken {
    return new RefreshToken(
      record.id,
      record.tokenHash,
      record.familyId,
      record.userId,
      record.userType as 'SUBSCRIBER' | 'PROFESSIONAL',
      record.clinicId,
      record.expiresAt,
      record.revokedAt,
      record.createdAt
    );
  }
}
