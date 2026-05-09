import { Injectable } from '@nestjs/common';
import { count, eq } from 'drizzle-orm';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import type {
  CreateSubscriberData,
  ISubscriberRepository,
  SubscriberPage,
  UpdateSubscriberData,
} from '../../../domain/ports/out/subscriber.repository';
import { clinics, subscribers } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleSubscriberRepository implements ISubscriberRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateSubscriberData): Promise<Subscriber> {
    const [row] = await this.drizzle.db.insert(subscribers).values(data).returning();
    return row as Subscriber;
  }

  async findById(id: string): Promise<Subscriber | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(subscribers)
      .where(eq(subscribers.id, id))
      .limit(1);
    return (row as Subscriber) ?? null;
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);
    return (row as Subscriber) ?? null;
  }

  async findByDocument(document: string): Promise<Subscriber | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(subscribers)
      .where(eq(subscribers.document, document))
      .limit(1);
    return (row as Subscriber) ?? null;
  }

  async findAll(page: number, limit: number): Promise<SubscriberPage> {
    const skip = (page - 1) * limit;
    const [items, [{ value: total }]] = await Promise.all([
      this.drizzle.db
        .select()
        .from(subscribers)
        .orderBy(subscribers.createdAt)
        .offset(skip)
        .limit(limit),
      this.drizzle.db.select({ value: count() }).from(subscribers),
    ]);
    return { items: items as Subscriber[], total: Number(total) };
  }

  async update(id: string, data: UpdateSubscriberData): Promise<Subscriber> {
    const [row] = await this.drizzle.db
      .update(subscribers)
      .set(data)
      .where(eq(subscribers.id, id))
      .returning();
    return row as Subscriber;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(subscribers).where(eq(subscribers.id, id));
  }

  async countClinics(subscriberId: string): Promise<number> {
    const [{ value }] = await this.drizzle.db
      .select({ value: count() })
      .from(clinics)
      .where(eq(clinics.subscriberId, subscriberId));
    return Number(value);
  }
}
