import {
  Controller, Get, Post, Put, Param, Query, Body, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List courses' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'accessType', required: false })
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('subjectId') subjectId?: string,
    @Query('status') status?: string,
    @Query('accessType') accessType?: string,
  ) {
    const result = await this.coursesService.findAll({ page, pageSize, subjectId, status, accessType });
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course detail' })
  async findOne(@Param('id') id: string) {
    const course = await this.coursesService.findById(id);
    return { success: true, data: course };
  }

  @Post()
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Create course (Maker/Admin)' })
  async create(@Body() body: { title: string; subjectId?: string; description?: string; accessType?: string; pointCost?: number }, @Request() req: any) {
    const course = await this.coursesService.create(body, req.user.sub, req.user.tenantId);
    return { success: true, data: course };
  }

  @Post(':id/submit')
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Submit course for review (Maker)' })
  async submit(@Param('id') id: string, @Request() req: any) {
    const course = await this.coursesService.submitForReview(id, req.user.sub);
    return { success: true, data: course };
  }

  @Post(':id/approve')
  @Roles('Admin', 'Checker')
  @ApiOperation({ summary: 'Approve course (Checker)' })
  async approve(@Param('id') id: string, @Request() req: any) {
    const course = await this.coursesService.approve(id, req.user.sub);
    return { success: true, data: course };
  }

  @Post(':id/reject')
  @Roles('Admin', 'Checker')
  @ApiOperation({ summary: 'Reject course (Checker)' })
  async reject(@Param('id') id: string, @Body() body: { reason: string }, @Request() req: any) {
    const course = await this.coursesService.reject(id, req.user.sub, body.reason);
    return { success: true, data: course };
  }
}
