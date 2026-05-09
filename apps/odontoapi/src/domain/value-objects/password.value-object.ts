export class Password {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;
  // bcrypt silently truncates at 72 bytes — enforcing 128 char max prevents DoS
  private static readonly PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Password {
    if (!Password.isValid(raw)) {
      throw new Error(
        'Senha deve ter entre 8 e 128 caracteres, com ao menos uma maiúscula, uma minúscula, um número e um caractere especial'
      );
    }
    return new Password(raw);
  }

  static isValid(raw: string): boolean {
    if (raw.length < Password.MIN_LENGTH || raw.length > Password.MAX_LENGTH) return false;
    return Password.PATTERN.test(raw);
  }

  toString(): string {
    return this.value;
  }
}
