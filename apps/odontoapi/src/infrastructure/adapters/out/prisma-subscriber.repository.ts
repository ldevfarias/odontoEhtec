import { Injectable } from '@nestjs/common';
import type {
  ISubscriberRepository,
  CreateSubscriberData,
  UpdateSubscriberData,
  SubscriberPage,
} from '../../../domain/ports/out/subscriber.repository';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import type { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSubscriberRepository implements ISubscriberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubscriberData): Promise<Subscriber> {
    return this.prisma.subscriber.create({ data });
  }

  async findById(id: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { email } });
  }

  async findByDocument(document: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { document } });
  }

  async findAll(page: number, limit: number): Promise<SubscriberPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.subscriber.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.subscriber.count(),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdateSubscriberData): Promise<Subscriber> {
    return this.prisma.subscriber.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscriber.delete({ where: { id } });
  }
}
