export class Cpf {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Cpf {
    const digits = raw.replace(/\D/g, '');
    if (!Cpf.isValid(digits)) {
      throw new Error('CPF inválido');
    }
    return new Cpf(digits);
  }

  static isValid(raw: string): boolean {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    const calcDigit = (slice: string): number => {
      const sum = slice
        .split('')
        .reduce((acc, d, i) => acc + Number(d) * (slice.length + 1 - i), 0);
      const rem = (sum * 10) % 11;
      return rem >= 10 ? 0 : rem;
    };

    const d1 = calcDigit(digits.slice(0, 9));
    if (d1 !== Number(digits[9])) return false;
    const d2 = calcDigit(digits.slice(0, 10));
    return d2 === Number(digits[10]);
  }

  toString(): string {
    return this.value;
  }

  formatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
