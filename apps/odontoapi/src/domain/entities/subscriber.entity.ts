export class Subscriber {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly document: string,
    public readonly phone: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
