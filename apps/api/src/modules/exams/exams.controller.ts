import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly service: ExamsService) {}

  @Get()
  @ApiOperation({ summary: 'List exams' })
  async findAll(@Query() query: any, @Request() req: any) {
    const result = await this.service.findAll({ ...query, tenantId: req.user.tenantId });
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam detail' })
  async findOne(@Param('id') id: string) {
    return { success: true, data: await this.service.findById(id) };
  }

  @Post()
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Create exam' })
  async create(@Body() body: any, @Request() req: any) {
    const exam = await this.service.create(body, req.user.sub, req.user.tenantId);
    return { success: true, data: exam };
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start exam attempt' })
  async start(@Param('id') id: string, @Request() req: any) {
    const attempt = await this.service.startAttempt(id, req.user.sub);
    return { success: true, data: attempt };
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Submit exam answers' })
  async submit(@Param('id') id: string, @Body() body: { attemptId: string; answers: any[] }) {
    const result = await this.service.submitAttempt(body.attemptId, body.answers);
    return { success: true, data: result };
  }

  @Get(':id/attempts')
  @ApiOperation({ summary: 'Get user attempts for exam' })
  async getAttempts(@Param('id') id: string, @Request() req: any) {
    const attempts = await this.service.getAttempts(id, req.user.sub);
    return { success: true, data: attempts };
  }
}
