import { Injectable } from '@nestjs/common';

export interface ProcessedLesson {
  title: string;
  content: string;
  contentType: 'text' | 'formula' | 'exercise';
  keyPoints: string[];
  quizQuestions: {
    content: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string; // Lời giải chi tiết BẮT BUỘC
  }[];
}

export interface ProcessedSubject {
  subjectName: string;
  chapters: {
    title: string;
    lessons: ProcessedLesson[];
  }[];
  examQuestions: {
    content: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation: string;
    difficulty: string;
  }[];
}

@Injectable()
export class KnowledgeProcessorService {
  /**
   * Process all files for a subject into structured course content
   * 
   * Logic:
   * - Công thức → Bài giảng + Quiz (KHÔNG vào luyện đề)
   * - Lý thuyết → Bài giảng + Quiz (KHÔNG vào luyện đề)  
   * - Bài tập giải → Bài giảng (bài mẫu) + Quiz kèm lời giải chi tiết
   * - Đề + đáp án → Luyện đề (giữ nguyên)
   * - Tổng hợp câu hỏi → Luyện đề (giữ nguyên)
   */
  processSubject(files: { filename: string; category: string; content: string }[]): ProcessedSubject {
    const subject: ProcessedSubject = {
      subjectName: '',
      chapters: [],
      examQuestions: [],
    };

    // Group files by category
    const knowledgeFiles = files.filter((f) => f.category === 'knowledge');
    const formulaFiles = files.filter((f) => f.category === 'formula');
    const exerciseFiles = files.filter((f) => f.category === 'exercise');
    const examFiles = files.filter((f) => f.category === 'exam_with_answers' || f.category === 'question_bank');

    // Chapter 1: Lý thuyết (from knowledge files)
    if (knowledgeFiles.length > 0) {
      subject.chapters.push({
        title: 'Lý thuyết cơ bản',
        lessons: knowledgeFiles.map((f) => ({
          title: this.extractTitle(f.filename),
          content: f.content,
          contentType: 'text' as const,
          keyPoints: this.extractKeyPoints(f.content),
          quizQuestions: [], // Will be filled by AI with detailed explanations
        })),
      });
    }

    // Chapter 2: Công thức & Tính toán (from formula files)
    // → Vào bài giảng + quiz, KHÔNG vào luyện đề
    if (formulaFiles.length > 0) {
      subject.chapters.push({
        title: 'Công thức & Tính toán',
        lessons: formulaFiles.map((f) => ({
          title: this.extractTitle(f.filename),
          content: f.content,
          contentType: 'formula' as const,
          keyPoints: this.extractFormulas(f.content),
          quizQuestions: [], // AI generates with step-by-step explanation
        })),
      });
    }

    // Chapter 3: Bài tập mẫu (from exercise files)
    // → Bài giảng với lời giải chi tiết
    if (exerciseFiles.length > 0) {
      subject.chapters.push({
        title: 'Bài tập mẫu & Lời giải',
        lessons: exerciseFiles.map((f) => ({
          title: this.extractTitle(f.filename),
          content: f.content,
          contentType: 'exercise' as const,
          keyPoints: [],
          quizQuestions: [], // AI generates similar exercises with detailed solutions
        })),
      });
    }

    // Exam questions: from exam_with_answers and question_bank files
    // → Giữ nguyên vào Luyện đề
    examFiles.forEach((f) => {
      // Extract questions preserving original Q&A
      // These go directly to exam bank, not to quiz
    });

    return subject;
  }

  /**
   * Extract a clean title from filename
   */
  private extractTitle(filename: string): string {
    return filename
      .replace(/\.(pdf|docx|doc|xlsx|txt)$/i, '')
      .replace(/^\d+[\s._-]*/, '') // Remove leading numbers
      .replace(/[_-]+/g, ' ')
      .trim();
  }

  /**
   * Extract key points from content (paragraphs, headings)
   */
  private extractKeyPoints(content: string): string[] {
    if (!content) return [];
    // Split by headings or numbered items
    const points = content.split(/\n(?=\d+[.)]\s|\*\s|[-•]\s|[A-Z])/);
    return points.slice(0, 10).map((p) => p.trim()).filter((p) => p.length > 10);
  }

  /**
   * Extract formulas from content
   */
  private extractFormulas(content: string): string[] {
    if (!content) return [];
    // Look for lines with = sign or formula indicators
    const lines = content.split('\n');
    return lines
      .filter((l) => l.includes('=') || l.includes('công thức') || l.includes('CT:'))
      .map((l) => l.trim())
      .filter((l) => l.length > 5);
  }
}
