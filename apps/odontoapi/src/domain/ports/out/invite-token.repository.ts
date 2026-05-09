export const INVITE_TOKEN_REPOSITORY = Symbol('IInviteTokenRepository');

export interface CreateInviteTokenData {
  tokenHash: string;
  professionalId: string;
  expiresAt: Date;
}

export interface InviteTokenRecord {
  id: string;
  professionalId: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  revokedAt: Date | null;
}

export interface IInviteTokenRepository {
  create(data: CreateInviteTokenData): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<InviteTokenRecord | null>;
  markAsAccepted(tokenHash: string): Promise<void>;
  revokeAllByProfessionalId(professionalId: string): Promise<void>;
}
