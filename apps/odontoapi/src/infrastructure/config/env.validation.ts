interface EnvShape {
  DATABASE_URL?: string;
  NODE_ENV?: string;
  PORT?: string;
}

const ALLOWED_NODE_ENVS = new Set(['development', 'test', 'production']);

export function validateEnv(env: NodeJS.ProcessEnv): void {
  const currentEnv: EnvShape = {
    DATABASE_URL: env['DATABASE_URL'],
    NODE_ENV: env['NODE_ENV'],
    PORT: env['PORT'],
  };

  if (!currentEnv.DATABASE_URL || currentEnv.DATABASE_URL.trim() === '') {
    throw new Error('Missing required env var: DATABASE_URL');
  }

  if (currentEnv.NODE_ENV && !ALLOWED_NODE_ENVS.has(currentEnv.NODE_ENV)) {
    throw new Error('NODE_ENV must be one of: development, test, production');
  }

  if (currentEnv.PORT && !/^\d+$/.test(currentEnv.PORT)) {
    throw new Error('PORT must be a numeric string');
  }
}
