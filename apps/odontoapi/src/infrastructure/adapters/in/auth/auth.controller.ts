import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  ACCEPT_INVITE_USE_CASE,
  type IAcceptInviteUseCase,
} from '../../../../domain/ports/in/auth/accept-invite.use-case';
import {
  FORGOT_PASSWORD_USE_CASE,
  type IForgotPasswordUseCase,
} from '../../../../domain/ports/in/auth/forgot-password.use-case';
import {
  LOGIN_USE_CASE,
  type ILoginUseCase,
} from '../../../../domain/ports/in/auth/login.use-case';
import {
  LOGOUT_USE_CASE,
  type ILogoutUseCase,
} from '../../../../domain/ports/in/auth/logout.use-case';
import {
  REFRESH_TOKEN_USE_CASE,
  type IRefreshTokenUseCase,
} from '../../../../domain/ports/in/auth/refresh-token.use-case';
import {
  REGISTER_SUBSCRIBER_USE_CASE,
  type IRegisterSubscriberUseCase,
} from '../../../../domain/ports/in/auth/register-subscriber.use-case';
import {
  RESET_PASSWORD_USE_CASE,
  type IResetPasswordUseCase,
} from '../../../../domain/ports/in/auth/reset-password.use-case';
import {
  VALIDATE_INVITE_TOKEN_USE_CASE,
  type IValidateInviteTokenUseCase,
} from '../../../../domain/ports/in/auth/validate-invite-token.use-case';
import {
  VERIFY_EMAIL_USE_CASE,
  type IVerifyEmailUseCase,
} from '../../../../domain/ports/in/auth/verify-email.use-case';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type {
  AcceptInviteDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './auth.dto';
import type { JwtPayload } from './jwt-payload.interface';
import type { LoginDto } from './login.dto';
import type { RegisterSubscriberDto } from './register-subscriber.dto';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 min
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const IS_PRODUCTION = process.env['NODE_ENV'] === 'production';
const USER_AGENT_HEADER = 'user-agent';

function setAccessTokenCookie(res: Response, token: string): void {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });
}

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/api/auth/refresh',
  });
}

function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(REGISTER_SUBSCRIBER_USE_CASE)
    private readonly registerSubscriber: IRegisterSubscriberUseCase,
    @Inject(VERIFY_EMAIL_USE_CASE)
    private readonly verifyEmail: IVerifyEmailUseCase,
    @Inject(LOGIN_USE_CASE)
    private readonly login: ILoginUseCase,
    @Inject(REFRESH_TOKEN_USE_CASE)
    private readonly refreshToken: IRefreshTokenUseCase,
    @Inject(LOGOUT_USE_CASE)
    private readonly logout: ILogoutUseCase,
    @Inject(VALIDATE_INVITE_TOKEN_USE_CASE)
    private readonly validateInviteToken: IValidateInviteTokenUseCase,
    @Inject(ACCEPT_INVITE_USE_CASE)
    private readonly acceptInvite: IAcceptInviteUseCase,
    @Inject(FORGOT_PASSWORD_USE_CASE)
    private readonly forgotPassword: IForgotPasswordUseCase,
    @Inject(RESET_PASSWORD_USE_CASE)
    private readonly resetPassword: IResetPasswordUseCase
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  async register(@Body() dto: RegisterSubscriberDto): Promise<{ message: string }> {
    return this.registerSubscriber.execute(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  async verifyEmailHandler(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) _res: Response
  ): Promise<{ onboardingComplete: boolean }> {
    await this.verifyEmail.execute({ token: dto.token });
    // After verification, user needs to login — redirect handled by frontend
    return { onboardingComplete: false };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  async loginHandler(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ userType: string; onboardingComplete: boolean }> {
    const result = await this.login.execute({
      email: dto.email,
      password: dto.password,
      ipAddress: req.ip,
      userAgent: req.headers[USER_AGENT_HEADER],
    });

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);

    // Never expose tokens in response body
    return { userType: result.userType, onboardingComplete: result.onboardingComplete };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 3600000 } })
  async refreshHandler(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const token = (req.cookies as Record<string, string>)?.['refresh_token'];
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Sessão inválida' });
      return;
    }

    const result = await this.refreshToken.execute({
      refreshToken: token,
      ipAddress: req.ip,
      userAgent: req.headers[USER_AGENT_HEADER],
    });

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logoutHandler(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const token = (req.cookies as Record<string, string>)?.['refresh_token'] ?? '';

    await this.logout.execute({
      refreshToken: token,
      userId: user.sub,
      userType: user.userType,
      subscriberId: user.subscriberId,
      ipAddress: req.ip,
      userAgent: req.headers[USER_AGENT_HEADER],
    });

    clearAuthCookies(res);
  }

  @Get('invite/validate')
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  async validateInvite(@Query('token') token: string): Promise<{
    professionalName: string;
    email: string;
  }> {
    const result = await this.validateInviteToken.execute({ token });
    return { professionalName: result.professionalName, email: result.email };
  }

  @Post('accept-invite')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  async acceptInviteHandler(
    @Body() dto: AcceptInviteDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const result = await this.acceptInvite.execute({
      token: dto.token,
      password: dto.password,
      ipAddress: req.ip,
      userAgent: req.headers[USER_AGENT_HEADER],
    });

    setAccessTokenCookie(res, result.accessToken);
    setRefreshTokenCookie(res, result.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  async forgotPasswordHandler(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    return this.forgotPassword.execute({ email: dto.email });
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  async resetPasswordHandler(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.resetPassword.execute({ token: dto.token, newPassword: dto.newPassword });
  }
}
