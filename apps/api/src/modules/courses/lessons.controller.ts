import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  async findOne(@Param('id') id: string) {
    const lesson = await this.coursesService.findLessonById(id);
    if (!lesson) return { success: false, error: { message: 'Lesson not found' } };
    return { success: true, data: lesson };
  }
}
