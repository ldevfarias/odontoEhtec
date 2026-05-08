export class Patient {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly cpf: string,
    public readonly birthDate: Date | null,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly clinicId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
