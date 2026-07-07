import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new account' })
  async register(@Body() body: { username: string; email: string; fullName: string; password: string }) {
    const user = await this.authService.register(body);
    return { success: true, data: user };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    return { success: true, data: result };
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
    return { success: true, data: { message: 'Logged out successfully' } };
  }
}
