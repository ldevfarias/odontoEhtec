export const CREATE_SUBSCRIBER_USE_CASE = Symbol('ICreateSubscriberUseCase');

export interface CreateSubscriberInput {
  name: string;
  email: string;
  document: string;
  phone?: string;
}

export interface CreateSubscriberOutput {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriberUseCase {
  execute(input: CreateSubscriberInput): Promise<CreateSubscriberOutput>;
}
