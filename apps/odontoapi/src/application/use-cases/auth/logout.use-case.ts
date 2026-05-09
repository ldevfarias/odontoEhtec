import { Inject, Injectable } from '@nestjs/common';
import type { ILogoutUseCase, LogoutInput } from '../../../domain/ports/in/auth/logout.use-case';
import {
  AUDIT_REPOSITORY,
  type IAuditRepository,
} from '../../../domain/ports/out/audit.repository';
import {
  REFRESH_TOKEN_REPOSITORY,
  type IRefreshTokenRepository,
} from '../../../domain/ports/out/refresh-token.repository';
import { hashToken } from './token.utils';

@Injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(AUDIT_REPOSITORY)
    private readonly auditRepository: IAuditRepository
  ) {}

  async execute(input: LogoutInput): Promise<void> {
    const tokenHash = hashToken(input.refreshToken);
    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);

    await this.auditRepository.log({
      action: 'LOGOUT',
      userId: input.userId,
      userType: input.userType,
      subscriberId: input.subscriberId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }
}
