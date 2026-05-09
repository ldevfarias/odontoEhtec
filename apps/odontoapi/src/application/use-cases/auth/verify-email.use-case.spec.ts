import { BadRequestException } from '@nestjs/common';
import type { UserCredential } from '../../../domain/entities/user-credential.entity';
import type { IEmailVerificationTokenRepository } from '../../../domain/ports/out/email-verification-token.repository';
import type { IUserCredentialRepository } from '../../../domain/ports/out/user-credential.repository';
import { VerifyEmailUseCase } from './verify-email.use-case';

const makeVerificationTokenRepo = (): jest.Mocked<IEmailVerificationTokenRepository> => ({
  create: jest.fn(),
  findByTokenHash: jest.fn(),
  markAsUsed: jest.fn(),
});

const makeCredentialRepo = (): jest.Mocked<IUserCredentialRepository> => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findBySubscriberId: jest.fn(),
  findByProfessionalId: jest.fn(),
  updatePasswordHash: jest.fn(),
});

const VERIFY_EMAIL = 'joao@email.com';
const SUBSCRIBER_ID = 'subscriber-1';
const PASSWORD_HASH = '$2b$12$hash';
const DATE_2026 = new Date('2026-01-01');

const makeCredential = (overrides: Partial<UserCredential> = {}): UserCredential => ({
  id: 'cred-1',
  email: VERIFY_EMAIL,
  passwordHash: PASSWORD_HASH,
  subscriberId: SUBSCRIBER_ID,
  professionalId: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
  ...overrides,
});

const validTokenRecord = {
  email: VERIFY_EMAIL,
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  usedAt: null,
};

describe('VerifyEmailUseCase', () => {
  let useCase: VerifyEmailUseCase;
  let verificationTokenRepo: jest.Mocked<IEmailVerificationTokenRepository>;
  let credentialRepo: jest.Mocked<IUserCredentialRepository>;

  beforeEach(() => {
    verificationTokenRepo = makeVerificationTokenRepo();
    credentialRepo = makeCredentialRepo();
    useCase = new VerifyEmailUseCase(verificationTokenRepo, credentialRepo);
  });

  it('verifica email com token válido e retorna dados do usuário', async () => {
    verificationTokenRepo.findByTokenHash.mockResolvedValue(validTokenRecord);
    credentialRepo.findByEmail.mockResolvedValue(makeCredential());
    verificationTokenRepo.markAsUsed.mockResolvedValue(undefined);

    const result = await useCase.execute({ token: 'valid-raw-token' });

    expect(result.userType).toBe('SUBSCRIBER');
    expect(result.subscriberId).toBe('subscriber-1');
    expect(verificationTokenRepo.markAsUsed).toHaveBeenCalledTimes(1);
  });

  it('lança BadRequestException para token inexistente', async () => {
    verificationTokenRepo.findByTokenHash.mockResolvedValue(null);

    await expect(useCase.execute({ token: 'invalid' })).rejects.toThrow(BadRequestException);
  });

  it('lança BadRequestException para token já utilizado', async () => {
    verificationTokenRepo.findByTokenHash.mockResolvedValue({
      ...validTokenRecord,
      usedAt: DATE_2026,
    });

    await expect(useCase.execute({ token: 'used-token' })).rejects.toThrow(BadRequestException);
  });

  it('lança BadRequestException para token expirado', async () => {
    verificationTokenRepo.findByTokenHash.mockResolvedValue({
      ...validTokenRecord,
      expiresAt: new Date('2020-01-01'),
    });

    await expect(useCase.execute({ token: 'expired-token' })).rejects.toThrow(BadRequestException);
  });
});
