import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Initiate SSO/OIDC login' })
  async login(@Body() body: { redirectUri?: string }) {
    // In production, this redirects to Keycloak
    // For development, we issue a dev token
    const devPayload = {
      sub: '00000000-0000-0000-0000-000000000100',
      tenantId: '00000000-0000-0000-0000-000000000001',
      username: 'admin',
      email: 'admin@htstudy.vn',
      roles: ['Admin'],
    };

    const { accessToken, expiresIn } = await this.authService.generateToken(devPayload);

    return {
      success: true,
      data: {
        accessToken,
        expiresIn,
        user: {
          id: devPayload.sub,
          username: devPayload.username,
          email: devPayload.email,
          roles: devPayload.roles,
        },
      },
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async refresh(@Request() req: any) {
    const { accessToken, expiresIn } = await this.authService.generateToken(req.user);
    return { success: true, data: { accessToken, expiresIn } };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    return { success: true, data: req.user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout() {
    // Invalidate session in Redis (to be implemented)
    return { success: true, data: { message: 'Logged out successfully' } };
  }
}
