export class Phone {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Phone {
    const digits = raw.replace(/\D/g, '');
    if (!Phone.isValid(digits)) {
      throw new Error('Telefone inválido');
    }
    return new Phone(digits);
  }

  static isValid(raw: string): boolean {
    const digits = raw.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  toString(): string {
    return this.value;
  }
}
