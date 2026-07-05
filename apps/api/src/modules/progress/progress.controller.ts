import { Controller, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @Get('resume')
  @ApiOperation({ summary: 'Get resume learning data' })
  async getResume(@Request() req: any) {
    return { success: true, data: await this.service.getResumeData(req.user.sub) };
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Get progress for a course' })
  async getProgress(@Param('courseId') courseId: string, @Request() req: any) {
    return { success: true, data: await this.service.getProgress(req.user.sub, courseId) };
  }

  @Put(':courseId')
  @ApiOperation({ summary: 'Save progress (auto-save)' })
  async saveProgress(@Param('courseId') courseId: string, @Body() body: any, @Request() req: any) {
    const progress = await this.service.saveProgress(req.user.sub, courseId, body);
    return { success: true, data: progress };
  }

  @Get()
  @ApiOperation({ summary: 'Get all progress' })
  async getAllProgress(@Request() req: any) {
    return { success: true, data: await this.service.getAllProgress(req.user.sub) };
  }
}
