import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('roles')
  @Roles('Admin')
  @ApiOperation({ summary: 'List all roles' })
  async findAllRoles(@Request() req: any) {
    const roles = await this.rolesService.findAllRoles(req.user.tenantId);
    return { success: true, data: roles };
  }

  @Post('roles')
  @Roles('Admin')
  @ApiOperation({ summary: 'Create custom role' })
  async createRole(@Body() body: { name: string; description?: string }, @Request() req: any) {
    const role = await this.rolesService.createRole({ ...body, tenantId: req.user.tenantId });
    return { success: true, data: role };
  }

  @Delete('roles/:id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete role' })
  async deleteRole(@Param('id') id: string) {
    await this.rolesService.deleteRole(id);
    return { success: true, data: { message: 'Role deleted' } };
  }

  @Get('permissions')
  @Roles('Admin')
  @ApiOperation({ summary: 'List all permissions' })
  async findAllPermissions() {
    const perms = await this.rolesService.findAllPermissions();
    return { success: true, data: perms };
  }

  @Post('permissions')
  @Roles('Admin')
  @ApiOperation({ summary: 'Create permission' })
  async createPermission(@Body() body: { resource: string; action: string; description?: string }) {
    const perm = await this.rolesService.createPermission(body);
    return { success: true, data: perm };
  }
}
