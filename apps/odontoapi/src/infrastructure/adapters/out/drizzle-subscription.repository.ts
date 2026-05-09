import { Injectable } from '@nestjs/common';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import type { Subscription } from '../../../domain/entities/subscription.entity';
import type {
  CreateSubscriptionData,
  ISubscriptionRepository,
  SubscriptionPage,
  UpdateSubscriptionData,
} from '../../../domain/ports/out/subscription.repository';
import { subscriptions } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleSubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateSubscriptionData): Promise<Subscription> {
    const [row] = await this.drizzle.db.insert(subscriptions).values(data).returning();
    return row as Subscription;
  }

  async findById(id: string): Promise<Subscription | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .limit(1);
    return (row as Subscription) ?? null;
  }

  async findActiveBySubscriber(subscriberId: string): Promise<Subscription | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.subscriberId, subscriberId),
          inArray(subscriptions.status, ['TRIAL', 'ACTIVE'])
        )
      )
      .limit(1);
    return (row as Subscription) ?? null;
  }

  async findAllBySubscriber(
    subscriberId: string,
    page: number,
    limit: number
  ): Promise<SubscriptionPage> {
    const skip = (page - 1) * limit;
    const [items, [{ value: total }]] = await Promise.all([
      this.drizzle.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.subscriberId, subscriberId))
        .orderBy(desc(subscriptions.createdAt))
        .offset(skip)
        .limit(limit),
      this.drizzle.db
        .select({ value: count() })
        .from(subscriptions)
        .where(eq(subscriptions.subscriberId, subscriberId)),
    ]);
    return { items: items as Subscription[], total: Number(total) };
  }

  async update(id: string, data: UpdateSubscriptionData): Promise<Subscription> {
    const [row] = await this.drizzle.db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, id))
      .returning();
    return row as Subscription;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(subscriptions).where(eq(subscriptions.id, id));
  }
}
