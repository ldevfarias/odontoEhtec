export class Cnpj {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Cnpj {
    const digits = raw.replace(/\D/g, '');
    if (!Cnpj.isValid(digits)) {
      throw new Error('CNPJ inválido');
    }
    return new Cnpj(digits);
  }

  static isValid(raw: string): boolean {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false;

    const calcDigit = (str: string, weights: number[]): number => {
      const sum = str.split('').reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
      const rem = sum % 11;
      return rem < 2 ? 0 : 11 - rem;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const d1 = calcDigit(digits.slice(0, 12), w1);
    if (d1 !== Number(digits[12])) return false;
    const d2 = calcDigit(digits.slice(0, 13), w2);
    return d2 === Number(digits[13]);
  }

  toString(): string {
    return this.value;
  }

  formatted(): string {
    return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
