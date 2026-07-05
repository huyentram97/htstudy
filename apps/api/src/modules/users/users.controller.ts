import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('Admin')
  @ApiOperation({ summary: 'List users (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'locked'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.usersService.findAll({ page, pageSize, status, search });
    return { success: true, ...result };
  }

  @Get(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return { success: true, data: user };
  }

  @Post()
  @Roles('Admin')
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() dto: CreateUserDto, @Request() req: any) {
    const user = await this.usersService.create(dto, req.user.tenantId);
    return { success: true, data: user };
  }

  @Patch(':id/status')
  @Roles('Admin')
  @ApiOperation({ summary: 'Change user status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const user = await this.usersService.updateStatus(id, body.status);
    return { success: true, data: user };
  }

  @Delete(':id')
  @Roles('Admin')
  @ApiOperation({ summary: 'Delete user' })
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true, data: { message: 'User deleted' } };
  }
}
