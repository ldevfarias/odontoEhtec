export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';

export class Subscription {
  constructor(
    public readonly id: string,
    public readonly subscriberId: string,
    public readonly planId: string,
    public readonly status: SubscriptionStatus,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
