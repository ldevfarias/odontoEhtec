import { Cnpj } from './cnpj.value-object';

describe('Cnpj', () => {
  it('cria CNPJ válido removendo formatação', () => {
    const cnpj = Cnpj.create('11.222.333/0001-81');
    expect(cnpj.toString()).toBe('11222333000181');
  });

  it('retorna CNPJ formatado', () => {
    const cnpj = Cnpj.create('11222333000181');
    expect(cnpj.formatted()).toBe('11.222.333/0001-81');
  });

  it('lança erro para CNPJ com todos os dígitos iguais', () => {
    expect(() => Cnpj.create('00.000.000/0000-00')).toThrow('CNPJ inválido');
  });

  it('lança erro para CNPJ com dígito verificador incorreto', () => {
    expect(() => Cnpj.create('11.222.333/0001-82')).toThrow('CNPJ inválido');
  });

  it('lança erro para CNPJ com menos de 14 dígitos', () => {
    expect(() => Cnpj.create('1122233300018')).toThrow('CNPJ inválido');
  });

  it('retorna true para CNPJ válido via isValid', () => {
    expect(Cnpj.isValid('11222333000181')).toBe(true);
  });
});
