import type { UserCredential } from '../../entities/user-credential.entity';

export const USER_CREDENTIAL_REPOSITORY = Symbol('IUserCredentialRepository');

export interface CreateUserCredentialData {
  email: string;
  passwordHash: string;
  subscriberId?: string;
  professionalId?: string;
}

export interface IUserCredentialRepository {
  create(data: CreateUserCredentialData): Promise<UserCredential>;
  findByEmail(email: string): Promise<UserCredential | null>;
  findBySubscriberId(subscriberId: string): Promise<UserCredential | null>;
  findByProfessionalId(professionalId: string): Promise<UserCredential | null>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
}
