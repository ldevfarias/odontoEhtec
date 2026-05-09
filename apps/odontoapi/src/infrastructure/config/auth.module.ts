import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClinicModule } from './clinic.module';
import { SubscriberModule } from './subscriber.module';

// Output port symbols
import { AUDIT_REPOSITORY } from '../../domain/ports/out/audit.repository';
import { EMAIL_VERIFICATION_TOKEN_REPOSITORY } from '../../domain/ports/out/email-verification-token.repository';
import { INVITE_TOKEN_REPOSITORY } from '../../domain/ports/out/invite-token.repository';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from '../../domain/ports/out/password-reset-token.repository';
import { PROFESSIONAL_REPOSITORY } from '../../domain/ports/out/professional.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/ports/out/refresh-token.repository';
import { USER_CREDENTIAL_REPOSITORY } from '../../domain/ports/out/user-credential.repository';

// Input port symbols
import { ACCEPT_INVITE_USE_CASE } from '../../domain/ports/in/auth/accept-invite.use-case';
import { FORGOT_PASSWORD_USE_CASE } from '../../domain/ports/in/auth/forgot-password.use-case';
import { INVITE_PROFESSIONAL_USE_CASE } from '../../domain/ports/in/auth/invite-professional.use-case';
import { LOGIN_USE_CASE } from '../../domain/ports/in/auth/login.use-case';
import { LOGOUT_USE_CASE } from '../../domain/ports/in/auth/logout.use-case';
import { REFRESH_TOKEN_USE_CASE } from '../../domain/ports/in/auth/refresh-token.use-case';
import { REGISTER_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/auth/register-subscriber.use-case';
import { RESET_PASSWORD_USE_CASE } from '../../domain/ports/in/auth/reset-password.use-case';
import { VALIDATE_INVITE_TOKEN_USE_CASE } from '../../domain/ports/in/auth/validate-invite-token.use-case';
import { VERIFY_EMAIL_USE_CASE } from '../../domain/ports/in/auth/verify-email.use-case';

// Repository implementations
import { DrizzleAuditRepository } from '../adapters/out/drizzle-audit.repository';
import { DrizzleEmailVerificationTokenRepository } from '../adapters/out/drizzle-email-verification-token.repository';
import { DrizzleInviteTokenRepository } from '../adapters/out/drizzle-invite-token.repository';
import { DrizzlePasswordResetTokenRepository } from '../adapters/out/drizzle-password-reset-token.repository';
import { DrizzleProfessionalRepository } from '../adapters/out/drizzle-professional.repository';
import { DrizzleRefreshTokenRepository } from '../adapters/out/drizzle-refresh-token.repository';
import { DrizzleUserCredentialRepository } from '../adapters/out/drizzle-user-credential.repository';

// Use case implementations
import { AcceptInviteUseCase } from '../../application/use-cases/auth/accept-invite.use-case';
import { ForgotPasswordUseCase } from '../../application/use-cases/auth/forgot-password.use-case';
import { InviteProfessionalUseCase } from '../../application/use-cases/auth/invite-professional.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/auth/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { RegisterSubscriberUseCase } from '../../application/use-cases/auth/register-subscriber.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/auth/reset-password.use-case';
import { ValidateInviteTokenUseCase } from '../../application/use-cases/auth/validate-invite-token.use-case';
import { VerifyEmailUseCase } from '../../application/use-cases/auth/verify-email.use-case';

// Infrastructure
import { AuthController } from '../adapters/in/auth/auth.controller';
import { JwtStrategy } from '../adapters/in/strategies/jwt.strategy';

@Module({
  imports: [
    ClinicModule, // provides CLINIC_REPOSITORY
    SubscriberModule, // provides SUBSCRIBER_REPOSITORY
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [
    // Repositories
    { provide: PROFESSIONAL_REPOSITORY, useClass: DrizzleProfessionalRepository },
    { provide: USER_CREDENTIAL_REPOSITORY, useClass: DrizzleUserCredentialRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: DrizzleRefreshTokenRepository },
    {
      provide: EMAIL_VERIFICATION_TOKEN_REPOSITORY,
      useClass: DrizzleEmailVerificationTokenRepository,
    },
    { provide: INVITE_TOKEN_REPOSITORY, useClass: DrizzleInviteTokenRepository },
    { provide: PASSWORD_RESET_TOKEN_REPOSITORY, useClass: DrizzlePasswordResetTokenRepository },
    { provide: AUDIT_REPOSITORY, useClass: DrizzleAuditRepository },

    // Use cases
    { provide: REGISTER_SUBSCRIBER_USE_CASE, useClass: RegisterSubscriberUseCase },
    { provide: VERIFY_EMAIL_USE_CASE, useClass: VerifyEmailUseCase },
    { provide: LOGIN_USE_CASE, useClass: LoginUseCase },
    { provide: REFRESH_TOKEN_USE_CASE, useClass: RefreshTokenUseCase },
    { provide: LOGOUT_USE_CASE, useClass: LogoutUseCase },
    { provide: INVITE_PROFESSIONAL_USE_CASE, useClass: InviteProfessionalUseCase },
    { provide: VALIDATE_INVITE_TOKEN_USE_CASE, useClass: ValidateInviteTokenUseCase },
    { provide: ACCEPT_INVITE_USE_CASE, useClass: AcceptInviteUseCase },
    { provide: FORGOT_PASSWORD_USE_CASE, useClass: ForgotPasswordUseCase },
    { provide: RESET_PASSWORD_USE_CASE, useClass: ResetPasswordUseCase },

    // Passport
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AUDIT_REPOSITORY, JwtModule],
})
export class AuthModule {}
