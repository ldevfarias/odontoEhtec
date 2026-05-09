import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../../../drizzle/schema';

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;
  readonly db: DrizzleDb;

  constructor() {
    this.pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit(): Promise<void> {
    await this.pool.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
