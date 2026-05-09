export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly tokenHash: string,
    public readonly familyId: string,
    public readonly userId: string,
    public readonly userType: 'SUBSCRIBER' | 'PROFESSIONAL',
    public readonly clinicId: string | null,
    public readonly expiresAt: Date,
    public readonly revokedAt: Date | null,
    public readonly createdAt: Date
  ) {}

  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  get isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  get isValid(): boolean {
    return !this.isExpired && !this.isRevoked;
  }
}
