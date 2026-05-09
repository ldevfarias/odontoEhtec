import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { UserCredential } from '../../../domain/entities/user-credential.entity';
import type { IAuditRepository } from '../../../domain/ports/out/audit.repository';
import type { IRefreshTokenRepository } from '../../../domain/ports/out/refresh-token.repository';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import type { IUserCredentialRepository } from '../../../domain/ports/out/user-credential.repository';
import { LoginUseCase } from './login.use-case';

const makeCredentialRepo = (): jest.Mocked<IUserCredentialRepository> => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findBySubscriberId: jest.fn(),
  findByProfessionalId: jest.fn(),
  updatePasswordHash: jest.fn(),
});

const makeSubscriberRepo = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  countClinics: jest.fn(),
});

const makeRefreshTokenRepo = (): jest.Mocked<IRefreshTokenRepository> => ({
  create: jest.fn(),
  findByTokenHash: jest.fn(),
  revokeByTokenHash: jest.fn(),
  revokeAllByFamilyId: jest.fn(),
  revokeAllByUserId: jest.fn(),
});

const makeAuditRepo = (): jest.Mocked<IAuditRepository> => ({
  log: jest.fn(),
});

const makeJwtService = (): jest.Mocked<Pick<JwtService, 'sign'>> => ({
  sign: jest.fn().mockReturnValue('mock-access-token'),
});

const LOGIN_EMAIL = 'joao@email.com';
const LOGIN_PASSWORD = 'Senha@123';

const makeCredential = (overrides: Partial<UserCredential> = {}): UserCredential => ({
  id: 'cred-1',
  email: LOGIN_EMAIL,
  passwordHash: '', // will be set in tests
  subscriberId: 'subscriber-1',
  professionalId: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let credentialRepo: jest.Mocked<IUserCredentialRepository>;
  let subscriberRepo: jest.Mocked<ISubscriberRepository>;
  let refreshTokenRepo: jest.Mocked<IRefreshTokenRepository>;
  let auditRepo: jest.Mocked<IAuditRepository>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  let validPasswordHash: string;

  beforeAll(async () => {
    validPasswordHash = await bcrypt.hash('Senha@123', 12);
  });

  beforeEach(() => {
    credentialRepo = makeCredentialRepo();
    subscriberRepo = makeSubscriberRepo();
    refreshTokenRepo = makeRefreshTokenRepo();
    auditRepo = makeAuditRepo();
    jwtService = makeJwtService();
    useCase = new LoginUseCase(
      credentialRepo,
      subscriberRepo,
      refreshTokenRepo,
      auditRepo,
      jwtService as unknown as JwtService
    );
  });

  it('retorna tokens e dados do usuário em login bem-sucedido', async () => {
    const credential = makeCredential({ passwordHash: validPasswordHash });
    credentialRepo.findByEmail.mockResolvedValue(credential);
    subscriberRepo.countClinics.mockResolvedValue(1);
    refreshTokenRepo.create.mockResolvedValue(undefined as never);
    auditRepo.log.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    });

    expect(result.accessToken).toBe('mock-access-token');
    expect(result.refreshToken).toBeDefined();
    expect(result.userType).toBe('SUBSCRIBER');
    expect(result.subscriberId).toBe('subscriber-1');
    expect(result.onboardingComplete).toBe(true);
    expect(refreshTokenRepo.create).toHaveBeenCalledTimes(1);
    expect(auditRepo.log).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'LOGIN_SUCCESS' })
    );
  });

  it('onboardingComplete é false quando subscriber não tem clínicas', async () => {
    const credential = makeCredential({ passwordHash: validPasswordHash });
    credentialRepo.findByEmail.mockResolvedValue(credential);
    subscriberRepo.countClinics.mockResolvedValue(0);
    refreshTokenRepo.create.mockResolvedValue(undefined as never);
    auditRepo.log.mockResolvedValue(undefined);

    const result = await useCase.execute({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD });

    expect(result.onboardingComplete).toBe(false);
  });

  it('lança UnauthorizedException com senha errada', async () => {
    const credential = makeCredential({ passwordHash: validPasswordHash });
    credentialRepo.findByEmail.mockResolvedValue(credential);
    auditRepo.log.mockResolvedValue(undefined);

    await expect(
      useCase.execute({ email: LOGIN_EMAIL, password: 'SenhaErrada@1' })
    ).rejects.toThrow(UnauthorizedException);

    expect(auditRepo.log).toHaveBeenCalledWith(expect.objectContaining({ action: 'LOGIN_FAILED' }));
  });

  it('lança UnauthorizedException quando email não existe (timing-safe path)', async () => {
    credentialRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'inexistente@email.com', password: LOGIN_PASSWORD })
    ).rejects.toThrow(UnauthorizedException);

    // Audit should NOT be called when credential not found (anti-enumeration)
    expect(auditRepo.log).not.toHaveBeenCalled();
  });
});
