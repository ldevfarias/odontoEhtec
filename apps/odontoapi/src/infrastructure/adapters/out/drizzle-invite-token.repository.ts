import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import type {
  CreateInviteTokenData,
  IInviteTokenRepository,
  InviteTokenRecord,
} from '../../../domain/ports/out/invite-token.repository';
import { inviteTokens } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleInviteTokenRepository implements IInviteTokenRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateInviteTokenData): Promise<void> {
    await this.drizzle.db.insert(inviteTokens).values(data);
  }

  async findByTokenHash(tokenHash: string): Promise<InviteTokenRecord | null> {
    const [row] = await this.drizzle.db
      .select({
        id: inviteTokens.id,
        professionalId: inviteTokens.professionalId,
        expiresAt: inviteTokens.expiresAt,
        acceptedAt: inviteTokens.acceptedAt,
        revokedAt: inviteTokens.revokedAt,
      })
      .from(inviteTokens)
      .where(eq(inviteTokens.tokenHash, tokenHash))
      .limit(1);
    return row ?? null;
  }

  async markAsAccepted(tokenHash: string): Promise<void> {
    await this.drizzle.db
      .update(inviteTokens)
      .set({ acceptedAt: new Date() })
      .where(eq(inviteTokens.tokenHash, tokenHash));
  }

  async revokeAllByProfessionalId(professionalId: string): Promise<void> {
    await this.drizzle.db
      .update(inviteTokens)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(inviteTokens.professionalId, professionalId),
          isNull(inviteTokens.revokedAt),
          isNull(inviteTokens.acceptedAt)
        )
      );
  }
}
