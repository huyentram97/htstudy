import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContentImportController } from './content-import.controller';
import { ContentImportService } from './content-import.service';
import { DocumentReaderService } from './services/document-reader.service';
import { FileParserService } from './services/file-parser.service';
import { ContentClassifierService } from './services/content-classifier.service';
import { DeduplicationService } from './services/deduplication.service';
import { QuestionExtractorService } from './services/question-extractor.service';
import { KnowledgeProcessorService } from './services/knowledge-processor.service';
import { AIQuizGeneratorService } from './services/ai-quiz-generator.service';
import { ImportPipelineService } from './services/import-pipeline.service';
import { Question } from '../questions/entities/question.entity';
import { Course } from '../courses/entities/course.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Course]), ConfigModule, AuthModule],
  controllers: [ContentImportController],
  providers: [
    ContentImportService,
    DocumentReaderService,
    FileParserService,
    ContentClassifierService,
    DeduplicationService,
    QuestionExtractorService,
    KnowledgeProcessorService,
    AIQuizGeneratorService,
    ImportPipelineService,
  ],
  exports: [ContentImportService, ImportPipelineService],
})
export class ContentImportModule {}
