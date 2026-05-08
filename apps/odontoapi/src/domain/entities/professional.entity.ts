export type ProfessionalRole = 'DENTIST' | 'RECEPTIONIST' | 'ADMIN';

export class Professional {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly phone: string | null,
    public readonly role: ProfessionalRole,
    public readonly clinicId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
