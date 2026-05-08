export const DELETE_SUBSCRIBER_USE_CASE = Symbol('IDeleteSubscriberUseCase');

export interface DeleteSubscriberInput {
  id: string;
}

export interface IDeleteSubscriberUseCase {
  execute(input: DeleteSubscriberInput): Promise<void>;
}
