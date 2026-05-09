import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type {
  IResetPasswordUseCase,
  ResetPasswordInput,
} from '../../../domain/ports/in/auth/reset-password.use-case';
import {
  PASSWORD_RESET_TOKEN_REPOSITORY,
  type IPasswordResetTokenRepository,
} from '../../../domain/ports/out/password-reset-token.repository';
import {
  REFRESH_TOKEN_REPOSITORY,
  type IRefreshTokenRepository,
} from '../../../domain/ports/out/refresh-token.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { Password } from '../../../domain/value-objects/password.value-object';
import { hashToken } from './token.utils';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @Inject(PASSWORD_RESET_TOKEN_REPOSITORY)
    private readonly passwordResetTokenRepository: IPasswordResetTokenRepository,
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    Password.create(input.newPassword); // validates strength

    const tokenHash = hashToken(input.token);
    const record = await this.passwordResetTokenRepository.findByTokenHash(tokenHash);

    if (!record || record.usedAt !== null || record.expiresAt < new Date()) {
      throw new BadRequestException('Link de redefinição inválido ou expirado');
    }

    const credential = await this.userCredentialRepository.findByEmail(record.email);
    if (!credential) {
      throw new BadRequestException('Link de redefinição inválido ou expirado');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);

    await this.userCredentialRepository.updatePasswordHash(credential.id, passwordHash);
    await this.passwordResetTokenRepository.markAsUsed(tokenHash);
    // Invalidate all active sessions after password change (security best practice)
    await this.refreshTokenRepository.revokeAllByUserId(credential.id);
  }
}
