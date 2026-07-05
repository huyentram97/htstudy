import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SystemConfigService } from './config.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('config')
export class SystemConfigController {
  constructor(private readonly service: SystemConfigService) {}

  @Get('system')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get all system config' })
  async getAll(@Request() req: any) {
    return { success: true, data: await this.service.getAll(req.user.tenantId) };
  }

  @Put('system')
  @Roles('Admin')
  @ApiOperation({ summary: 'Update system config' })
  async update(@Body() body: Record<string, any>, @Request() req: any) {
    const config = await this.service.setBulk(req.user.tenantId, body, req.user.sub);
    return { success: true, data: config };
  }
}
