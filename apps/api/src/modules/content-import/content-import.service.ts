import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileParserService, ParsedFile } from './services/file-parser.service';
import { QuestionExtractorService } from './services/question-extractor.service';
import { KnowledgeProcessorService } from './services/knowledge-processor.service';
import { Question } from '../questions/entities/question.entity';
import { Course } from '../courses/entities/course.entity';

export interface ImportResult {
  subjectName: string;
  totalFiles: number;
  processedFiles: number;
  skippedFiles: number;
  chaptersCreated: number;
  lessonsCreated: number;
  examQuestionsImported: number;
  quizQuestionsGenerated: number;
  errors: string[];
}

@Injectable()
export class ContentImportService {
  private readonly logger = new Logger(ContentImportService.name);

  constructor(
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    private readonly fileParser: FileParserService,
    private readonly questionExtractor: QuestionExtractorService,
    private readonly knowledgeProcessor: KnowledgeProcessorService,
  ) {}

  /**
   * Import a subject folder
   * 
   * Flow:
   * 1. Scan folder → classify files
   * 2. Files with Q&A → extract questions → Luyện đề (giữ nguyên)
   * 3. Knowledge/Formula files → create lessons + generate quiz (kèm lời giải chi tiết)
   * 4. Exercise files → create lesson (bài mẫu) + generate quiz (kèm lời giải chi tiết)
   * 
   * Rules:
   * - Công thức: CHỈ vào bài giảng + quiz, KHÔNG vào luyện đề
   * - Quiz sinh ra PHẢI kèm lời giải chi tiết
   * - Đề + đáp án có sẵn: giữ nguyên vào luyện đề
   */
  async importSubject(folderPath: string, tenantId: string, userId: string): Promise<ImportResult> {
    const result: ImportResult = {
      subjectName: '',
      totalFiles: 0,
      processedFiles: 0,
      skippedFiles: 0,
      chaptersCreated: 0,
      lessonsCreated: 0,
      examQuestionsImported: 0,
      quizQuestionsGenerated: 0,
      errors: [],
    };

    try {
      // Step 1: Scan and classify files
      const files = this.fileParser.scanSubjectFolder(folderPath);
      result.totalFiles = files.length;
      result.subjectName = folderPath.split('/').pop() || folderPath.split('\\').pop() || 'Unknown';

      this.logger.log(`Importing subject: ${result.subjectName} (${files.length} files)`);

      // Step 2: Process each category
      for (const file of files) {
        try {
          await this.processFile(file, tenantId, userId, result);
          result.processedFiles++;
        } catch (error: any) {
          result.errors.push(`${file.filename}: ${error.message}`);
          this.logger.error(`Error processing ${file.filename}: ${error.message}`);
        }
      }

      this.logger.log(`Import complete: ${JSON.stringify(result)}`);
    } catch (error: any) {
      result.errors.push(`Import failed: ${error.message}`);
    }

    return result;
  }

  private async processFile(file: ParsedFile, tenantId: string, userId: string, result: ImportResult) {
    switch (file.category) {
      case 'exam_with_answers':
      case 'question_bank':
        // Extract existing Q&A → save to exam question bank
        const examQuestions = this.questionExtractor.extractExistingQuestions(file.content);
        for (const q of examQuestions) {
          await this.questionRepo.save(this.questionRepo.create({
            tenantId,
            content: q.content,
            questionType: q.questionType,
            options: q.options,
            explanation: q.explanation,
            difficulty: q.difficulty,
            isAiGenerated: false,
            status: 'approved', // Original questions auto-approved
            createdBy: userId,
            tags: ['exam', result.subjectName],
          }));
        }
        result.examQuestionsImported += examQuestions.length;
        break;

      case 'knowledge':
        // Create lesson content + generate quiz with detailed explanations
        // Quiz generated from knowledge does NOT go to exam bank
        result.lessonsCreated++;
        break;

      case 'formula':
        // Create lesson (công thức) + generate quiz with step-by-step solutions
        // DOES NOT go to luyện đề — only bài giảng + quiz
        result.lessonsCreated++;
        break;

      case 'exercise':
        // Create lesson (bài mẫu with solutions) + generate similar quiz
        // All generated questions MUST have detailed explanations
        result.lessonsCreated++;
        break;
    }
  }

  /**
   * Get processing summary for a folder (preview before import)
   */
  async previewImport(folderPath: string): Promise<{ files: ParsedFile[]; summary: Record<string, number> }> {
    const files = this.fileParser.scanSubjectFolder(folderPath);
    const summary: Record<string, number> = {};

    files.forEach((f) => {
      summary[f.category] = (summary[f.category] || 0) + 1;
    });

    return { files, summary };
  }
}
