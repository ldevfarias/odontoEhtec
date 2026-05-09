export const INVITE_PROFESSIONAL_USE_CASE = Symbol('IInviteProfessionalUseCase');

export interface InviteProfessionalInput {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  clinicId: string;
  role: 'DENTIST' | 'RECEPTIONIST' | 'ASSISTANT';
  subscriberId: string;
  invitedByUserId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface InviteProfessionalOutput {
  professionalId: string;
  message: string;
}

export interface IInviteProfessionalUseCase {
  execute(input: InviteProfessionalInput): Promise<InviteProfessionalOutput>;
}
