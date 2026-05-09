export interface JwtPayload {
  sub: string;
  userType: 'SUBSCRIBER' | 'PROFESSIONAL';
  subscriberId: string;
  professionalId?: string;
  clinicId?: string;
  onboardingComplete: boolean;
  iat?: number;
  exp?: number;
}
