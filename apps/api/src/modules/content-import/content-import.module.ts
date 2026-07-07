import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentImportController } from './content-import.controller';
import { ContentImportService } from './content-import.service';
import { FileParserService } from './services/file-parser.service';
import { QuestionExtractorService } from './services/question-extractor.service';
import { KnowledgeProcessorService } from './services/knowledge-processor.service';
import { Question } from '../questions/entities/question.entity';
import { Course } from '../courses/entities/course.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Course]), AuthModule],
  controllers: [ContentImportController],
  providers: [ContentImportService, FileParserService, QuestionExtractorService, KnowledgeProcessorService],
  exports: [ContentImportService],
})
export class ContentImportModule {}
