export type UserType = 'SUBSCRIBER' | 'PROFESSIONAL';

export class UserCredential {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly subscriberId: string | null,
    public readonly professionalId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
