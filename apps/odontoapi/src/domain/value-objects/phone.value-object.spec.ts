import { Phone } from './phone.value-object';

describe('Phone', () => {
  it('cria telefone fixo válido (10 dígitos)', () => {
    const phone = Phone.create('(11) 3333-4444');
    expect(phone.toString()).toBe('1133334444');
  });

  it('cria celular válido (11 dígitos)', () => {
    const phone = Phone.create('(11) 99999-8888');
    expect(phone.toString()).toBe('11999998888');
  });

  it('lança erro para telefone com menos de 10 dígitos', () => {
    expect(() => Phone.create('123456789')).toThrow('Telefone inválido');
  });

  it('lança erro para telefone com mais de 11 dígitos', () => {
    expect(() => Phone.create('119999988881')).toThrow('Telefone inválido');
  });

  it('retorna true para número válido via isValid', () => {
    expect(Phone.isValid('11999998888')).toBe(true);
  });

  it('retorna false para número inválido via isValid', () => {
    expect(Phone.isValid('123')).toBe(false);
  });
});
