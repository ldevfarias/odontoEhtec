import { Cpf } from './cpf.value-object';

describe('Cpf', () => {
  it('cria CPF válido removendo formatação', () => {
    const cpf = Cpf.create('529.982.247-25');
    expect(cpf.toString()).toBe('52998224725');
  });

  it('retorna CPF formatado', () => {
    const cpf = Cpf.create('52998224725');
    expect(cpf.formatted()).toBe('529.982.247-25');
  });

  it('lança erro para CPF com todos os dígitos iguais', () => {
    expect(() => Cpf.create('111.111.111-11')).toThrow('CPF inválido');
  });

  it('lança erro para CPF com dígito verificador incorreto', () => {
    expect(() => Cpf.create('529.982.247-26')).toThrow('CPF inválido');
  });

  it('lança erro para CPF com menos de 11 dígitos', () => {
    expect(() => Cpf.create('1234567')).toThrow('CPF inválido');
  });

  it('retorna true para CPF válido via isValid', () => {
    expect(Cpf.isValid('52998224725')).toBe(true);
  });

  it('retorna false para CPF inválido via isValid', () => {
    expect(Cpf.isValid('00000000000')).toBe(false);
  });
});
