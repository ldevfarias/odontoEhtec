import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { UserCredential } from '../../../domain/entities/user-credential.entity';
import type {
  CreateUserCredentialData,
  IUserCredentialRepository,
} from '../../../domain/ports/out/user-credential.repository';
import { userCredentials } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleUserCredentialRepository implements IUserCredentialRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateUserCredentialData): Promise<UserCredential> {
    const [row] = await this.drizzle.db.insert(userCredentials).values(data).returning();
    return row as UserCredential;
  }

  async findByEmail(email: string): Promise<UserCredential | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(userCredentials)
      .where(eq(userCredentials.email, email))
      .limit(1);
    return (row as UserCredential) ?? null;
  }

  async findBySubscriberId(subscriberId: string): Promise<UserCredential | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(userCredentials)
      .where(eq(userCredentials.subscriberId, subscriberId))
      .limit(1);
    return (row as UserCredential) ?? null;
  }

  async findByProfessionalId(professionalId: string): Promise<UserCredential | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(userCredentials)
      .where(eq(userCredentials.professionalId, professionalId))
      .limit(1);
    return (row as UserCredential) ?? null;
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.drizzle.db
      .update(userCredentials)
      .set({ passwordHash })
      .where(eq(userCredentials.id, id));
  }
}
