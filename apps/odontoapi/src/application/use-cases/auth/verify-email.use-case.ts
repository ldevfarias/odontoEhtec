import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type {
  AuthTokensOutput,
  IVerifyEmailUseCase,
  VerifyEmailInput,
} from '../../../domain/ports/in/auth/verify-email.use-case';
import {
  EMAIL_VERIFICATION_TOKEN_REPOSITORY,
  type IEmailVerificationTokenRepository,
} from '../../../domain/ports/out/email-verification-token.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { hashToken } from './token.utils';

@Injectable()
export class VerifyEmailUseCase implements IVerifyEmailUseCase {
  constructor(
    @Inject(EMAIL_VERIFICATION_TOKEN_REPOSITORY)
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository,
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository
  ) {}

  async execute(input: VerifyEmailInput): Promise<AuthTokensOutput> {
    const tokenHash = hashToken(input.token);
    const record = await this.emailVerificationTokenRepository.findByTokenHash(tokenHash);

    if (!record || record.usedAt !== null || record.expiresAt < new Date()) {
      throw new BadRequestException('Link de verificação inválido ou expirado');
    }

    const credential = await this.userCredentialRepository.findByEmail(record.email);
    if (!credential) {
      throw new BadRequestException('Link de verificação inválido ou expirado');
    }

    await this.emailVerificationTokenRepository.markAsUsed(tokenHash);

    return {
      subscriberId: credential.subscriberId,
      professionalId: credential.professionalId,
      userType: credential.subscriberId ? 'SUBSCRIBER' : 'PROFESSIONAL',
    };
  }
}
