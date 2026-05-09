export const REGISTER_SUBSCRIBER_USE_CASE = Symbol('IRegisterSubscriberUseCase');

export interface RegisterSubscriberInput {
  name: string;
  email: string;
  password: string;
  document: string;
  phone?: string;
}

export interface RegisterSubscriberOutput {
  message: string;
}

export interface IRegisterSubscriberUseCase {
  execute(input: RegisterSubscriberInput): Promise<RegisterSubscriberOutput>;
}
