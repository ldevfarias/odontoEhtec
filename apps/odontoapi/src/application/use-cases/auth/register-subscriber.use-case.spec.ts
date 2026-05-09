import { ConflictException } from '@nestjs/common';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import type { UserCredential } from '../../../domain/entities/user-credential.entity';
import type { IEmailVerificationTokenRepository } from '../../../domain/ports/out/email-verification-token.repository';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';
import type { IUserCredentialRepository } from '../../../domain/ports/out/user-credential.repository';
import { RegisterSubscriberUseCase } from './register-subscriber.use-case';

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

const makeVerificationTokenRepo = (): jest.Mocked<IEmailVerificationTokenRepository> => ({
  create: jest.fn(),
  findByTokenHash: jest.fn(),
  markAsUsed: jest.fn(),
});

const REGISTER_EMAIL = 'joao@email.com';
const REGISTER_DOCUMENT = '12345678901';
const SUBSCRIBER_ID = 'subscriber-1';
const DATE_2026 = new Date('2026-01-01');

const makeSubscriber = (): Subscriber => ({
  id: SUBSCRIBER_ID,
  name: 'João Silva',
  email: REGISTER_EMAIL,
  document: REGISTER_DOCUMENT,
  phone: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
});

const makeCredential = (): UserCredential => ({
  id: 'cred-1',
  email: REGISTER_EMAIL,
  passwordHash: '$2b$12$hash',
  subscriberId: SUBSCRIBER_ID,
  professionalId: null,
  createdAt: DATE_2026,
  updatedAt: DATE_2026,
});

const validInput = {
  name: 'João Silva',
  email: REGISTER_EMAIL,
  password: 'Senha@123',
  document: REGISTER_DOCUMENT,
};

describe('RegisterSubscriberUseCase', () => {
  let useCase: RegisterSubscriberUseCase;
  let credentialRepo: jest.Mocked<IUserCredentialRepository>;
  let subscriberRepo: jest.Mocked<ISubscriberRepository>;
  let verificationTokenRepo: jest.Mocked<IEmailVerificationTokenRepository>;

  beforeEach(() => {
    credentialRepo = makeCredentialRepo();
    subscriberRepo = makeSubscriberRepo();
    verificationTokenRepo = makeVerificationTokenRepo();
    useCase = new RegisterSubscriberUseCase(credentialRepo, subscriberRepo, verificationTokenRepo);
  });

  it('registra subscriber com dados válidos e retorna mensagem de sucesso', async () => {
    credentialRepo.findByEmail.mockResolvedValue(null);
    subscriberRepo.findByDocument.mockResolvedValue(null);
    subscriberRepo.create.mockResolvedValue(makeSubscriber());
    credentialRepo.create.mockResolvedValue(makeCredential());
    verificationTokenRepo.create.mockResolvedValue(undefined as never);

    const result = await useCase.execute(validInput);

    expect(result.message).toContain('Verifique seu email');
    expect(subscriberRepo.create).toHaveBeenCalledTimes(1);
    expect(credentialRepo.create).toHaveBeenCalledTimes(1);
    expect(verificationTokenRepo.create).toHaveBeenCalledTimes(1);
  });

  it('lança ConflictException quando email já existe', async () => {
    credentialRepo.findByEmail.mockResolvedValue(makeCredential());

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictException);
    expect(subscriberRepo.create).not.toHaveBeenCalled();
  });

  it('lança ConflictException quando documento já existe', async () => {
    credentialRepo.findByEmail.mockResolvedValue(null);
    subscriberRepo.findByDocument.mockResolvedValue(makeSubscriber());

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictException);
    expect(subscriberRepo.create).not.toHaveBeenCalled();
  });

  it('lança Error quando email inválido', async () => {
    await expect(useCase.execute({ ...validInput, email: 'email-invalido' })).rejects.toThrow(
      Error
    );
  });

  it('lança Error quando senha fraca', async () => {
    await expect(useCase.execute({ ...validInput, password: 'fraca' })).rejects.toThrow(Error);
  });
});
