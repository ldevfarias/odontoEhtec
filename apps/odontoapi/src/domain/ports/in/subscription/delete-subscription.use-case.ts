export const DELETE_SUBSCRIPTION_USE_CASE = Symbol('IDeleteSubscriptionUseCase');

export interface DeleteSubscriptionInput {
  id: string;
}

export interface IDeleteSubscriptionUseCase {
  execute(input: DeleteSubscriptionInput): Promise<void>;
}
