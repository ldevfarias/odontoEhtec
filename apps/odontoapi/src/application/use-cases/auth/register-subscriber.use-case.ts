import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type {
  IRegisterSubscriberUseCase,
  RegisterSubscriberInput,
  RegisterSubscriberOutput,
} from '../../../domain/ports/in/auth/register-subscriber.use-case';
import {
  EMAIL_VERIFICATION_TOKEN_REPOSITORY,
  type IEmailVerificationTokenRepository,
} from '../../../domain/ports/out/email-verification-token.repository';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { Email } from '../../../domain/value-objects/email.value-object';
import { Password } from '../../../domain/value-objects/password.value-object';
import { generateOpaqueToken, hashToken } from './token.utils';

const BCRYPT_ROUNDS = 12;
const VERIFICATION_TOKEN_TTL_HOURS = 24;

@Injectable()
export class RegisterSubscriberUseCase implements IRegisterSubscriberUseCase {
  constructor(
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository,
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository,
    @Inject(EMAIL_VERIFICATION_TOKEN_REPOSITORY)
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository
  ) {}

  async execute(input: RegisterSubscriberInput): Promise<RegisterSubscriberOutput> {
    Email.create(input.email); // validates email format
    Password.create(input.password); // validates password strength

    const existing = await this.userCredentialRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('Este email já está em uso');
    }

    const existingByDocument = await this.subscriberRepository.findByDocument(input.document);
    if (existingByDocument) {
      throw new ConflictException('Este documento já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const subscriber = await this.subscriberRepository.create({
      name: input.name,
      email: input.email,
      document: input.document,
      phone: input.phone ?? null,
    });

    await this.userCredentialRepository.create({
      email: input.email,
      passwordHash,
      subscriberId: subscriber.id,
    });

    const rawToken = generateOpaqueToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await this.emailVerificationTokenRepository.create({
      tokenHash,
      email: input.email,
      expiresAt,
    });

    // TODO: enqueue email with link: /verificar-email?token=<rawToken>
    // EmailService will be injected when email provider is configured
    void rawToken; // rawToken will be passed to email service

    return { message: 'Cadastro realizado. Verifique seu email para ativar a conta.' };
  }
}
