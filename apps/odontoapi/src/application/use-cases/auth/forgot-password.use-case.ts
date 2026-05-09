import { Inject, Injectable } from '@nestjs/common';
import type {
  ForgotPasswordInput,
  ForgotPasswordOutput,
  IForgotPasswordUseCase,
} from '../../../domain/ports/in/auth/forgot-password.use-case';
import {
  PASSWORD_RESET_TOKEN_REPOSITORY,
  type IPasswordResetTokenRepository,
} from '../../../domain/ports/out/password-reset-token.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { generateOpaqueToken, hashToken } from './token.utils';

const RESET_TOKEN_TTL_HOURS = 1;
// Generic message prevents email enumeration
const GENERIC_MESSAGE = 'Se o email existir, você receberá um link para redefinir sua senha.';

@Injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository,
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository
  ) {}

  async execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    const credential = await this.userCredentialRepository.findByEmail(input.email);

    // Always return the same message regardless of whether user exists (anti-enumeration)
    if (!credential) {
      return { message: GENERIC_MESSAGE };
    }

    // Revoke any previous reset tokens for this email
    await this.passwordResetTokenRepository.revokeAllByEmail(input.email);

    const rawToken = generateOpaqueToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await this.passwordResetTokenRepository.create({ tokenHash, email: input.email, expiresAt });

    // TODO: enqueue email with link: /redefinir-senha?token=<rawToken>
    void rawToken;

    return { message: GENERIC_MESSAGE };
  }
}
