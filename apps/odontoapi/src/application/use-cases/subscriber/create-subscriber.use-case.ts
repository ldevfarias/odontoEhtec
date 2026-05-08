import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  ICreateSubscriberUseCase,
  CreateSubscriberInput,
  CreateSubscriberOutput,
} from '../../../domain/ports/in/subscriber/create-subscriber.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class CreateSubscriberUseCase implements ICreateSubscriberUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository,
  ) {}

  async execute(input: CreateSubscriberInput): Promise<CreateSubscriberOutput> {
    const emailNormalized = input.email.toLowerCase().trim();
    const documentDigits = input.document.replace(/\D/g, '');

    const [byEmail, byDocument] = await Promise.all([
      this.subscriberRepository.findByEmail(emailNormalized),
      this.subscriberRepository.findByDocument(documentDigits),
    ]);

    if (byEmail) throw new ConflictException('Email já cadastrado');
    if (byDocument) throw new ConflictException('Documento já cadastrado');

    const subscriber = await this.subscriberRepository.create({
      name: input.name,
      email: emailNormalized,
      document: documentDigits,
      phone: input.phone ?? null,
    });

    return {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      document: subscriber.document,
      phone: subscriber.phone,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }
}
