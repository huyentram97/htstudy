import { Injectable, Logger } from '@nestjs/common';
import { DocumentReaderService } from './document-reader.service';
import { ContentClassifierService, ClassifiedContent } from './content-classifier.service';
import { DeduplicationService } from './deduplication.service';
import { QuestionExtractorService, ExtractedQuestion } from './question-extractor.service';
import { AIQuizGeneratorService, GeneratedQuestion } from './ai-quiz-generator.service';

export interface ImportPipelineResult {
  subject: string;
  totalFiles: number;
  processedFiles: number;
  skippedFiles: string[];

  // Output for HỌC (Bài giảng)
  lessons: {
    chapter: string;
    title: string;
    content: string;
    type: 'theory' | 'formula' | 'exercise';
    quizQuestions: GeneratedQuestion[]; // Kèm lời giải chi tiết
  }[];

  // Output for LUYỆN ĐỀ
  examQuestions: ExtractedQuestion[]; // Giữ nguyên từ nguồn

  // Deduplication stats
  deduplication: {
    questionsInput: number;
    questionsUnique: number;
    questionsDuplicate: number;
    contentSectionsInput: number;
    contentSectionsUnique: number;
  };
}

@Injectable()
export class ImportPipelineService {
  private readonly logger = new Logger(ImportPipelineService.name);

  constructor(
    private readonly reader: DocumentReaderService,
    private readonly classifier: ContentClassifierService,
    private readonly dedup: DeduplicationService,
    private readonly questionExtractor: QuestionExtractorService,
    private readonly aiGenerator: AIQuizGeneratorService,
  ) {}

  /**
   * Full import pipeline:
   * 1. Đọc tất cả file trong folder
   * 2. Phân loại nội dung (lý thuyết / công thức / đề thi / bài tập)
   * 3. Sàng lọc trùng lặp
   * 4. Sinh output:
   *    - HỌC: bài giảng + quiz kèm lời giải chi tiết
   *    - LUYỆN ĐỀ: câu hỏi + đáp án (giữ nguyên từ nguồn)
   */
  async runPipeline(folderPath: string, subjectName: string): Promise<ImportPipelineResult> {
    const result: ImportPipelineResult = {
      subject: subjectName,
      totalFiles: 0,
      processedFiles: 0,
      skippedFiles: [],
      lessons: [],
      examQuestions: [],
      deduplication: {
        questionsInput: 0,
        questionsUnique: 0,
        questionsDuplicate: 0,
        contentSectionsInput: 0,
        contentSectionsUnique: 0,
      },
    };

    // === STEP 1: Đọc tất cả file ===
    this.logger.log(`[1/4] Reading files from: ${folderPath}`);
    const fileContents = await this.reader.readAllFiles(folderPath);
    result.totalFiles = fileContents.size;
    this.logger.log(`  → ${fileContents.size} files read`);

    // === STEP 2: Phân loại nội dung ===
    this.logger.log(`[2/4] Classifying content...`);
    const classified: ClassifiedContent[] = [];
    for (const [filename, content] of fileContents) {
      if (content.length < 100) {
        result.skippedFiles.push(filename);
        continue;
      }
      const classification = this.classifier.classifyContent(filename, content);
      classified.push(classification);
      result.processedFiles++;
      this.logger.log(`  ${filename} → ${classification.contentType} (confidence: ${(classification.confidence * 100).toFixed(0)}%)`);
    }

    // === STEP 3: Sàng lọc trùng lặp ===
    this.logger.log(`[3/4] Deduplication...`);

    // 3a. Collect all exam questions from exam_qa files
    const allExamQuestions: ExtractedQuestion[] = [];
    for (const file of classified.filter((f) => f.contentType === 'exam_qa')) {
      const fullContent = fileContents.get(file.filename) || '';
      const extracted = this.questionExtractor.extractExistingQuestions(fullContent);
      allExamQuestions.push(...extracted);
    }

    // Deduplicate exam questions
    result.deduplication.questionsInput = allExamQuestions.length;
    const dedupQuestions = this.dedup.deduplicateQuestions(allExamQuestions);
    result.examQuestions = dedupQuestions.uniqueItems;
    result.deduplication.questionsUnique = dedupQuestions.totalUnique;
    result.deduplication.questionsDuplicate = dedupQuestions.totalDuplicates;
    this.logger.log(`  Exam questions: ${allExamQuestions.length} → ${dedupQuestions.totalUnique} unique`);

    // 3b. Collect and deduplicate lesson content
    const allSections: { title: string; content: string; type: string; filename: string }[] = [];
    for (const file of classified.filter((f) => f.contentType !== 'exam_qa')) {
      for (const section of file.sections) {
        allSections.push({ title: section.title, content: section.content, type: file.contentType, filename: file.filename });
      }
    }

    result.deduplication.contentSectionsInput = allSections.length;
    const dedupContent = this.dedup.deduplicateContent(allSections);
    result.deduplication.contentSectionsUnique = dedupContent.totalUnique;
    this.logger.log(`  Content sections: ${allSections.length} → ${dedupContent.totalUnique} unique`);

    // === STEP 4: Sinh output ===
    this.logger.log(`[4/4] Generating output...`);

    // 4a. Group content by type → create lessons
    const theorySections = dedupContent.uniqueItems.filter((s: any) => s.type === 'theory');
    const formulaSections = dedupContent.uniqueItems.filter((s: any) => s.type === 'formula');
    const exerciseSections = dedupContent.uniqueItems.filter((s: any) => s.type === 'exercise');

    // Theory lessons + quiz with explanations
    for (const section of theorySections) {
      const quiz = await this.aiGenerator.generateFromKnowledge(section.content, subjectName, 5);
      result.lessons.push({
        chapter: 'Lý thuyết',
        title: section.title,
        content: section.content,
        type: 'theory',
        quizQuestions: quiz, // Kèm lời giải chi tiết
      });
    }

    // Formula lessons + quiz (KHÔNG vào luyện đề)
    for (const section of formulaSections) {
      const quiz = await this.aiGenerator.generateFromFormula(section.content, subjectName, 5);
      result.lessons.push({
        chapter: 'Công thức & Tính toán',
        title: section.title,
        content: section.content,
        type: 'formula',
        quizQuestions: quiz, // Kèm lời giải chi tiết từng bước
      });
    }

    // Exercise lessons + similar quiz
    for (const section of exerciseSections) {
      const quiz = await this.aiGenerator.generateFromExercise(section.content, subjectName, 3);
      result.lessons.push({
        chapter: 'Bài tập mẫu & Lời giải',
        title: section.title,
        content: section.content,
        type: 'exercise',
        quizQuestions: quiz, // Kèm lời giải chi tiết
      });
    }

    this.logger.log(`Pipeline complete: ${result.lessons.length} lessons, ${result.examQuestions.length} exam questions`);
    return result;
  }
}
