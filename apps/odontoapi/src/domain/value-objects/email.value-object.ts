export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    const normalized = raw.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new Error('Email inválido');
    }
    return new Email(normalized);
  }

  static isValid(raw: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
  }

  toString(): string {
    return this.value;
  }
}
