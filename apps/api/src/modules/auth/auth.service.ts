import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';

export interface JwtPayload {
  sub: string;
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
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async register(data: { username: string; email: string; fullName: string; password: string }) {
    // Validate
    if (!data.username || !data.email || !data.fullName || !data.password) {
      throw new BadRequestException('All fields are required');
    }
    if (data.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    // Check existing
    const existing = await this.userRepo.findOne({ where: [{ email: data.email }, { username: data.username }] });
    if (existing) {
      throw new ConflictException('Email or username already exists');
    }

    // Hash password
    const salt = this.generateSalt();
    const hashedPassword = this.hashPassword(data.password, salt);

    // Create user
    const user = this.userRepo.create({
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      passwordHash: `${salt}:${hashedPassword}`,
      tenantId: '00000000-0000-0000-0000-000000000001',
      status: 'active',
    });

    const saved = await this.userRepo.save(user);
    return { id: saved.id, username: saved.username, email: saved.email, fullName: saved.fullName };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email }, relations: ['roles'] });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status === 'locked') {
      throw new UnauthorizedException('Account is locked');
    }

    // Verify password
    if (user.passwordHash) {
      const [salt, hash] = user.passwordHash.split(':');
      const inputHash = this.hashPassword(password, salt);
      if (inputHash !== hash) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    // Generate token
    const roles = user.roles?.map((r) => r.name) || ['Customer'];
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      username: user.username,
      email: user.email,
      roles,
    };

    const { accessToken, expiresIn } = await this.generateToken(payload);

    // Update last login
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    return { accessToken, expiresIn, user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, roles } };
  }

  async generateToken(payload: JwtPayload): Promise<{ accessToken: string; expiresIn: number }> {
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, expiresIn: 3600 };
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      return null;
    }
  }
}
