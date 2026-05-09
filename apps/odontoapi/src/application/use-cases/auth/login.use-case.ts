import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type {
  ILoginUseCase,
  LoginInput,
  LoginOutput,
} from '../../../domain/ports/in/auth/login.use-case';
import {
  AUDIT_REPOSITORY,
  type IAuditRepository,
} from '../../../domain/ports/out/audit.repository';
import {
  REFRESH_TOKEN_REPOSITORY,
  type IRefreshTokenRepository,
} from '../../../domain/ports/out/refresh-token.repository';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { generateOpaqueToken, hashToken } from './token.utils';

// Dummy hash used for timing-safe comparison when user not found
const DUMMY_HASH = '$2b$12$invalidhashfortimingnormalization00000000000000000000000';
const REFRESH_TOKEN_TTL_DAYS = 7;

@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository,
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(AUDIT_REPOSITORY)
    private readonly auditRepository: IAuditRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const credential = await this.userCredentialRepository.findByEmail(input.email);

    // Always run bcrypt to prevent timing attacks even when user not found
    const hashToCompare = credential?.passwordHash ?? DUMMY_HASH;
    const passwordMatch = await bcrypt.compare(input.password, hashToCompare);

    if (!credential || !passwordMatch) {
      if (credential) {
        // Only audit on real credential found to avoid leaking existence via audit side-effects
        await this.auditRepository.log({
          action: 'LOGIN_FAILED',
          userId: credential.id,
          userType: credential.subscriberId ? 'SUBSCRIBER' : 'PROFESSIONAL',
          subscriberId: credential.subscriberId ?? credential.professionalId ?? credential.id,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        });
      }
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const userType = credential.subscriberId ? 'SUBSCRIBER' : 'PROFESSIONAL';
    const subscriberId = credential.subscriberId!;

    let onboardingComplete = true;
    if (userType === 'SUBSCRIBER') {
      onboardingComplete = await this.subscriberHasClinics(subscriberId);
    }

    const familyId = randomUUID();
    const rawRefreshToken = generateOpaqueToken();
    const refreshTokenHash = hashToken(rawRefreshToken);
    const refreshExpiry = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      tokenHash: refreshTokenHash,
      familyId,
      userId: credential.id,
      userType,
      expiresAt: refreshExpiry,
    });

    const accessTokenPayload = {
      sub: credential.id,
      userType,
      subscriberId,
      ...(credential.professionalId ? { professionalId: credential.professionalId } : {}),
      onboardingComplete,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload);

    await this.auditRepository.log({
      action: 'LOGIN_SUCCESS',
      userId: credential.id,
      userType,
      subscriberId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      userType,
      subscriberId,
      onboardingComplete,
    };
  }

  private async subscriberHasClinics(subscriberId: string): Promise<boolean> {
    const count = await this.subscriberRepository.countClinics(subscriberId);
    return count > 0;
  }
}
