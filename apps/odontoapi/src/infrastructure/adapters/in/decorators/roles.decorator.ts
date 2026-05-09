import type { CustomDecorator } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type AppRole = 'SUBSCRIBER' | 'DENTIST' | 'RECEPTIONIST' | 'ASSISTANT';

export const Roles = (...roles: AppRole[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
