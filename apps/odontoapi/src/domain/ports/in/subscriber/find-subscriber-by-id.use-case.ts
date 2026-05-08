export const FIND_SUBSCRIBER_BY_ID_USE_CASE = Symbol('IFindSubscriberByIdUseCase');

export interface FindSubscriberByIdInput {
  id: string;
}

export interface FindSubscriberByIdOutput {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindSubscriberByIdUseCase {
  execute(input: FindSubscriberByIdInput): Promise<FindSubscriberByIdOutput>;
}
