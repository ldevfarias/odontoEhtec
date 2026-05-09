import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import type { IRefreshTokenRepository } from '../../../domain/ports/out/refresh-token.repository';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { hashToken } from './token.utils';

const TOKEN_ID = 'token-id-1';
const RAW_TOKEN = 'some-raw-token';
const TOKEN_HASH = hashToken(RAW_TOKEN);
const FAMILY_ID = 'family-id-1';
const CREDENTIAL_ID = 'cred-1';
const DEFAULT_DATE = new Date('2026-01-01');

const makeRefreshTokenRepo = (): jest.Mocked<IRefreshTokenRepository> => ({
  create: jest.fn(),
  findByTokenHash: jest.fn(),
  revokeByTokenHash: jest.fn(),
  revokeAllByFamilyId: jest.fn(),
  revokeAllByUserId: jest.fn(),
});

const makeJwtService = (): Pick<JwtService, 'sign'> => ({
  sign: jest.fn(() => 'new-access-token') as unknown as JwtService['sign'],
});

const makeValidToken = (): RefreshToken => {
  return new RefreshToken(
    TOKEN_ID,
    TOKEN_HASH,
    FAMILY_ID,
    CREDENTIAL_ID,
    'SUBSCRIBER',
    null,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // future expiry
    null, // not revoked
    DEFAULT_DATE
  );
};

const makeRevokedToken = (): RefreshToken => {
  return new RefreshToken(
    TOKEN_ID,
    TOKEN_HASH,
    FAMILY_ID,
    CREDENTIAL_ID,
    'SUBSCRIBER',
    null,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    DEFAULT_DATE, // revoked
    DEFAULT_DATE
  );
};

const makeExpiredToken = (): RefreshToken => {
  return new RefreshToken(
    TOKEN_ID,
    TOKEN_HASH,
    FAMILY_ID,
    CREDENTIAL_ID,
    'SUBSCRIBER',
    null,
    new Date('2020-01-01'), // past expiry
    null,
    new Date('2020-01-01')
  );
};

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let refreshTokenRepo: jest.Mocked<IRefreshTokenRepository>;
  let jwtService: Pick<JwtService, 'sign'>;

  beforeEach(() => {
    refreshTokenRepo = makeRefreshTokenRepo();
    jwtService = makeJwtService();
    useCase = new RefreshTokenUseCase(refreshTokenRepo, jwtService as unknown as JwtService);
  });

  it('rotaciona o token e emite novo par', async () => {
    const rawToken = 'valid-raw-token-abc123';
    refreshTokenRepo.findByTokenHash.mockResolvedValue(makeValidToken());
    refreshTokenRepo.revokeByTokenHash.mockResolvedValue(undefined);
    refreshTokenRepo.create.mockResolvedValue(undefined as never);

    const result = await useCase.execute({ refreshToken: rawToken });

    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).not.toBe(rawToken);
    expect(result.refreshToken).toBeDefined();
    expect(refreshTokenRepo.revokeByTokenHash).toHaveBeenCalledTimes(1);
    expect(refreshTokenRepo.create).toHaveBeenCalledTimes(1);
  });

  it('revoga toda a família ao detectar reutilização de token (reuse detection)', async () => {
    refreshTokenRepo.findByTokenHash.mockResolvedValue(makeRevokedToken());
    refreshTokenRepo.revokeAllByFamilyId.mockResolvedValue(undefined);

    await expect(useCase.execute({ refreshToken: 'reused-token' })).rejects.toThrow(
      UnauthorizedException
    );

    expect(refreshTokenRepo.revokeAllByFamilyId).toHaveBeenCalledWith('family-id-1');
    expect(refreshTokenRepo.create).not.toHaveBeenCalled();
  });

  it('lança UnauthorizedException para token expirado', async () => {
    refreshTokenRepo.findByTokenHash.mockResolvedValue(makeExpiredToken());

    await expect(useCase.execute({ refreshToken: 'expired-token' })).rejects.toThrow(
      UnauthorizedException
    );

    expect(refreshTokenRepo.create).not.toHaveBeenCalled();
  });

  it('lança UnauthorizedException quando token não existe', async () => {
    refreshTokenRepo.findByTokenHash.mockResolvedValue(null);

    await expect(useCase.execute({ refreshToken: 'unknown-token' })).rejects.toThrow(
      UnauthorizedException
    );
  });
});
