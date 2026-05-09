import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { ROLES_KEY, type AppRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const user = request.user;

    if (!user) throw new ForbiddenException('Acesso negado');

    // SUBSCRIBER acts as ADMIN and has access to all subscriber-level roles
    const effectiveRole = user.userType === 'SUBSCRIBER' ? 'SUBSCRIBER' : user.userType;

    if (!requiredRoles.includes(effectiveRole as AppRole)) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
