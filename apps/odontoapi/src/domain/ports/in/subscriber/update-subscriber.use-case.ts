export const UPDATE_SUBSCRIBER_USE_CASE = Symbol('IUpdateSubscriberUseCase');

export interface UpdateSubscriberInput {
  id: string;
  name?: string;
  phone?: string | null;
}

export interface UpdateSubscriberOutput {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateSubscriberUseCase {
  execute(input: UpdateSubscriberInput): Promise<UpdateSubscriberOutput>;
}
