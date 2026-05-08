export const LIST_SUBSCRIBERS_USE_CASE = Symbol('IListSubscribersUseCase');

export interface ListSubscribersInput {
  page: number;
  limit: number;
}

export interface SubscriberItem {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListSubscribersOutput {
  items: SubscriberItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListSubscribersUseCase {
  execute(input: ListSubscribersInput): Promise<ListSubscribersOutput>;
}
