import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // user ID
  tenantId: string;
  username: string;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(payload: JwtPayload): Promise<{ accessToken: string; expiresIn: number }> {
    const expiresIn = this.configService.get('JWT_EXPIRES_IN', '60m');
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      expiresIn: 3600, // seconds
    };
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }
}
