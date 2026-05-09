import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type {
  AcceptInviteInput,
  AcceptInviteOutput,
  IAcceptInviteUseCase,
} from '../../../domain/ports/in/auth/accept-invite.use-case';
import {
  AUDIT_REPOSITORY,
  type IAuditRepository,
} from '../../../domain/ports/out/audit.repository';
import {
  INVITE_TOKEN_REPOSITORY,
  type IInviteTokenRepository,
} from '../../../domain/ports/out/invite-token.repository';
import {
  REFRESH_TOKEN_REPOSITORY,
  type IRefreshTokenRepository,
} from '../../../domain/ports/out/refresh-token.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';
import { Password } from '../../../domain/value-objects/password.value-object';
import { generateOpaqueToken, hashToken } from './token.utils';

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_DAYS = 7;

@Injectable()
export class AcceptInviteUseCase implements IAcceptInviteUseCase {
  constructor(
    @Inject(INVITE_TOKEN_REPOSITORY)
    private readonly inviteTokenRepository: IInviteTokenRepository,
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(AUDIT_REPOSITORY)
    private readonly auditRepository: IAuditRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: AcceptInviteInput): Promise<AcceptInviteOutput> {
    Password.create(input.password); // validates strength

    const tokenHash = hashToken(input.token);
    const record = await this.inviteTokenRepository.findByTokenHash(tokenHash);

    if (
      !record ||
      record.acceptedAt !== null ||
      record.revokedAt !== null ||
      record.expiresAt < new Date()
    ) {
      throw new BadRequestException('Link de convite inválido ou expirado');
    }

    const professional = await this.professionalRepository.findById(record.professionalId);

    if (!professional) {
      throw new BadRequestException('Link de convite inválido ou expirado');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const credential = await this.userCredentialRepository.create({
      email: professional.email,
      passwordHash,
      professionalId: professional.id,
    });

    await this.professionalRepository.update(professional.id, { status: 'ACTIVE' });

    await this.inviteTokenRepository.markAsAccepted(tokenHash);

    const clinicId =
      (await this.professionalRepository.getFirstClinicId(professional.id)) ?? undefined;
    const familyId = randomUUID();
    const rawRefreshToken = generateOpaqueToken();
    const refreshHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.create({
      tokenHash: refreshHash,
      familyId,
      userId: credential.id,
      userType: 'PROFESSIONAL',
      clinicId,
      expiresAt,
    });

    // Derive subscriberId from clinic
    const clinic = clinicId ? await this.clinicRepository.findById(clinicId) : null;
    const subscriberId = clinic?.subscriberId ?? professional.id;

    await this.auditRepository.log({
      action: 'INVITE_ACCEPTED',
      entity: 'Professional',
      entityId: professional.id,
      userId: credential.id,
      userType: 'PROFESSIONAL',
      subscriberId,
      clinicId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    const accessToken = this.jwtService.sign({
      sub: credential.id,
      userType: 'PROFESSIONAL',
      subscriberId,
      professionalId: professional.id,
      clinicId,
      onboardingComplete: true,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}
