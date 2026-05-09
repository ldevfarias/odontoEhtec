import { Email } from './email.value-object';

const INVALID_EMAIL = 'Email inválido';

describe('Email', () => {
  it('cria email válido e normaliza para minúsculas', () => {
    const email = Email.create('Contato@Clinica.COM');
    expect(email.toString()).toBe('contato@clinica.com');
  });

  it('lança erro para email sem @', () => {
    expect(() => Email.create('invalido.com')).toThrow(INVALID_EMAIL);
  });

  it('lança erro para email sem domínio', () => {
    expect(() => Email.create('user@')).toThrow(INVALID_EMAIL);
  });

  it('lança erro para string vazia', () => {
    expect(() => Email.create('')).toThrow(INVALID_EMAIL);
  });

  it('retorna true para email válido via isValid', () => {
    expect(Email.isValid('user@example.com')).toBe(true);
  });

  it('retorna false para email inválido via isValid', () => {
    expect(Email.isValid('not-an-email')).toBe(false);
  });
});
