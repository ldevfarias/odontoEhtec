import { Password } from './password.value-object';

describe('Password', () => {
  it('aceita senha válida com todos os requisitos', () => {
    expect(() => Password.create('Senha@123')).not.toThrow();
  });

  it('rejeita senha com menos de 8 caracteres', () => {
    expect(() => Password.create('Ab1@xyz')).toThrow();
  });

  it('rejeita senha sem letra maiúscula', () => {
    expect(() => Password.create('senha@123')).toThrow();
  });

  it('rejeita senha sem letra minúscula', () => {
    expect(() => Password.create('SENHA@123')).toThrow();
  });

  it('rejeita senha sem dígito', () => {
    expect(() => Password.create('Senha@abc')).toThrow();
  });

  it('rejeita senha sem caractere especial', () => {
    expect(() => Password.create('SenhaAbc1')).toThrow();
  });

  it('rejeita senha com mais de 128 caracteres', () => {
    const long = 'A1@' + 'a'.repeat(126);
    expect(() => Password.create(long)).toThrow();
  });

  it('isValid retorna true para senha válida', () => {
    expect(Password.isValid('Senha@123')).toBe(true);
  });

  it('isValid retorna false para senha inválida', () => {
    expect(Password.isValid('fraca')).toBe(false);
  });
});
