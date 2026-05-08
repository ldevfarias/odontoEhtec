import type { Subscriber } from '../../entities/subscriber.entity';

export const SUBSCRIBER_REPOSITORY = Symbol('ISubscriberRepository');

export interface CreateSubscriberData {
  name: string;
  email: string;
  document: string;
  phone: string | null;
}

export interface UpdateSubscriberData {
  name?: string;
  phone?: string | null;
}

export interface SubscriberPage {
  items: Subscriber[];
  total: number;
}

export interface ISubscriberRepository {
  create(data: CreateSubscriberData): Promise<Subscriber>;
  findById(id: string): Promise<Subscriber | null>;
  findByEmail(email: string): Promise<Subscriber | null>;
  findByDocument(document: string): Promise<Subscriber | null>;
  findAll(page: number, limit: number): Promise<SubscriberPage>;
  update(id: string, data: UpdateSubscriberData): Promise<Subscriber>;
  delete(id: string): Promise<void>;
}
