import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CoursesService } from './courses.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID (public)' })
  async findOne(@Param('id') id: string) {
    const lesson = await this.coursesService.findLessonById(id);
    if (!lesson) return { success: false, error: { message: 'Lesson not found' } };
    return { success: true, data: lesson };
  }
}
