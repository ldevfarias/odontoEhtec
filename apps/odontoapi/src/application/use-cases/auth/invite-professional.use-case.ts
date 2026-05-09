import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IInviteProfessionalUseCase,
  InviteProfessionalInput,
  InviteProfessionalOutput,
} from '../../../domain/ports/in/auth/invite-professional.use-case';
import {
  AUDIT_REPOSITORY,
  type IAuditRepository,
} from '../../../domain/ports/out/audit.repository';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';
import {
  INVITE_TOKEN_REPOSITORY,
  type IInviteTokenRepository,
} from '../../../domain/ports/out/invite-token.repository';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';
import {
  USER_CREDENTIAL_REPOSITORY,
  type IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { Cpf } from '../../../domain/value-objects/cpf.value-object';
import { Email } from '../../../domain/value-objects/email.value-object';
import { generateOpaqueToken, hashToken } from './token.utils';

const INVITE_TTL_HOURS = 48;

@Injectable()
export class InviteProfessionalUseCase implements IInviteProfessionalUseCase {
  constructor(
    @Inject(INVITE_TOKEN_REPOSITORY)
    private readonly inviteTokenRepository: IInviteTokenRepository,
    @Inject(AUDIT_REPOSITORY)
    private readonly auditRepository: IAuditRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
    @Inject(USER_CREDENTIAL_REPOSITORY)
    private readonly userCredentialRepository: IUserCredentialRepository
  ) {}

  async execute(input: InviteProfessionalInput): Promise<InviteProfessionalOutput> {
    Email.create(input.email);
    Cpf.create(input.cpf);

    // Verify clinic belongs to subscriber (tenant isolation)
    const clinic = await this.clinicRepository.findById(input.clinicId);
    if (!clinic || clinic.subscriberId !== input.subscriberId) {
      throw new NotFoundException('Clínica não encontrada');
    }

    const existingCredential = await this.userCredentialRepository.findByEmail(input.email);
    if (existingCredential) {
      throw new BadRequestException('Este email já possui uma conta');
    }

    // Revoke any previous pending invites for same email
    const existingProfessional = await this.professionalRepository.findByEmail(input.email);
    if (existingProfessional) {
      await this.inviteTokenRepository.revokeAllByProfessionalId(existingProfessional.id);
    }

    const professional = await this.professionalRepository.upsertForInvite({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone ?? null,
      clinicId: input.clinicId,
      role: input.role,
    });

    const rawToken = generateOpaqueToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);

    await this.inviteTokenRepository.create({
      tokenHash,
      professionalId: professional.id,
      expiresAt,
    });

    // TODO: enqueue email with link: /convite?token=<rawToken>
    void rawToken;

    await this.auditRepository.log({
      action: 'INVITE_SENT',
      entity: 'Professional',
      entityId: professional.id,
      userId: input.invitedByUserId,
      userType: 'SUBSCRIBER',
      subscriberId: input.subscriberId,
      clinicId: input.clinicId,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    return { professionalId: professional.id, message: 'Convite enviado com sucesso.' };
  }
}
