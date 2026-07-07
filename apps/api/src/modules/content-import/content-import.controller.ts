import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContentImportService } from './content-import.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Content Import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('import')
export class ContentImportController {
  constructor(private readonly service: ContentImportService) {}

  @Get('preview')
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Preview import - classify files before processing' })
  async preview(@Query('path') folderPath: string) {
    const result = await this.service.previewImport(folderPath);
    return { success: true, data: result };
  }

  @Post('subject')
  @Roles('Admin', 'Maker')
  @ApiOperation({ summary: 'Import a subject folder' })
  async importSubject(@Body() body: { folderPath: string }, @Request() req: any) {
    const result = await this.service.importSubject(body.folderPath, req.user.tenantId, req.user.sub);
    return { success: true, data: result };
  }
}
