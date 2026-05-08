import { Injectable } from '@nestjs/common';
import type {
  ISubscriptionRepository,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  SubscriptionPage,
} from '../../../domain/ports/out/subscription.repository';
import type { Subscription } from '../../../domain/entities/subscription.entity';
import type { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubscriptionData): Promise<Subscription> {
    return this.prisma.subscription.create({ data });
  }

  async findById(id: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({ where: { id } });
  }

  async findActiveBySubscriber(subscriberId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        subscriberId,
        status: { in: ['TRIAL', 'ACTIVE'] },
      },
    });
  }

  async findAllBySubscriber(
    subscriberId: string,
    page: number,
    limit: number
  ): Promise<SubscriptionPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.subscription.findMany({
        where: { subscriberId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where: { subscriberId } }),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdateSubscriptionData): Promise<Subscription> {
    return this.prisma.subscription.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscription.delete({ where: { id } });
  }
}
