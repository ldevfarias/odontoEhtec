import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../auth/jwt-payload.interface';

function extractJwtFromCookie(req: Request): string | null {
  return (req.cookies as Record<string, string>)?.['access_token'] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'] ?? '',
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
