import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IValidateInviteTokenUseCase,
  ValidateInviteTokenInput,
  ValidateInviteTokenOutput,
} from '../../../domain/ports/in/auth/validate-invite-token.use-case';
import {
  INVITE_TOKEN_REPOSITORY,
  type IInviteTokenRepository,
} from '../../../domain/ports/out/invite-token.repository';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';
import { hashToken } from './token.utils';

@Injectable()
export class ValidateInviteTokenUseCase implements IValidateInviteTokenUseCase {
  constructor(
    @Inject(INVITE_TOKEN_REPOSITORY)
    private readonly inviteTokenRepository: IInviteTokenRepository,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository
  ) {}

  async execute(input: ValidateInviteTokenInput): Promise<ValidateInviteTokenOutput> {
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
      throw new NotFoundException('Profissional não encontrado');
    }

    return {
      professionalId: professional.id,
      professionalName: professional.name,
      email: professional.email,
    };
  }
}
