import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  IRefreshTokenUseCase,
  RefreshTokenInput,
  RefreshTokenOutput,
} from '../../../domain/ports/in/auth/refresh-token.use-case';
import {
  REFRESH_TOKEN_REPOSITORY,
  type IRefreshTokenRepository,
} from '../../../domain/ports/out/refresh-token.repository';
import { generateOpaqueToken, hashToken } from './token.utils';

const REFRESH_TOKEN_TTL_DAYS = 7;

@Injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const tokenHash = hashToken(input.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!stored) {
      throw new UnauthorizedException('Sessão inválida');
    }

    // Reuse detection: if token is already revoked, revoke entire family (account takeover attempt)
    if (stored.isRevoked) {
      await this.refreshTokenRepository.revokeAllByFamilyId(stored.familyId);
      throw new UnauthorizedException('Sessão inválida. Faça login novamente.');
    }

    if (stored.isExpired) {
      throw new UnauthorizedException('Sessão expirada. Faça login novamente.');
    }

    // Rotate: revoke current, issue new in same family
    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);

    const rawNewRefreshToken = generateOpaqueToken();
    const newRefreshTokenHash = hashToken(rawNewRefreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      tokenHash: newRefreshTokenHash,
      familyId: stored.familyId,
      userId: stored.userId,
      userType: stored.userType,
      clinicId: stored.clinicId ?? undefined,
      expiresAt,
    });

    const accessToken = this.jwtService.sign({
      sub: stored.userId,
      userType: stored.userType,
      ...(stored.clinicId ? { clinicId: stored.clinicId } : {}),
    });

    return { accessToken, refreshToken: rawNewRefreshToken };
  }
}
