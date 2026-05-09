export type ProfessionalRole = 'DENTIST' | 'RECEPTIONIST' | 'ASSISTANT';
export type ProfessionalStatus = 'INVITED' | 'ACTIVE' | 'INACTIVE';

export class Professional {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly phone: string | null,
    public readonly status: ProfessionalStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export class ProfessionalClinic {
  constructor(
    public readonly professionalId: string,
    public readonly clinicId: string,
    public readonly role: ProfessionalRole
  ) {}
}
