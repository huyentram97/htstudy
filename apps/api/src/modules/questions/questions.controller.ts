import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: 'List questions with filters' })
  async findAll(@Query() query: any, @Request() req: any) {
    const result = await this.service.findAll({ ...query, tenantId: req.user.tenantId });
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  async findOne(@Param('id') id: string) {
    return { success: true, data: await this.service.findById(id) };
  }

  @Post()
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Create question' })
  async create(@Body() body: any, @Request() req: any) {
    const q = await this.service.create(body, req.user.sub, req.user.tenantId);
    return { success: true, data: q };
  }

  @Patch(':id/approve')
  @Roles('Admin', 'Checker')
  @ApiOperation({ summary: 'Approve question' })
  async approve(@Param('id') id: string, @Request() req: any) {
    return { success: true, data: await this.service.approve(id, req.user.sub) };
  }

  @Patch(':id/reject')
  @Roles('Admin', 'Checker')
  @ApiOperation({ summary: 'Reject question' })
  async reject(@Param('id') id: string) {
    return { success: true, data: await this.service.reject(id) };
  }

  @Delete(':id')
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Delete question' })
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { success: true, data: { message: 'Deleted' } };
  }
}
