import { Injectable, Logger } from '@nestjs/common';

export type ContentType = 'theory' | 'formula' | 'exam_qa' | 'exercise' | 'mixed';
export type OutputTarget = 'lesson' | 'quiz' | 'exam' | 'flashcard';

export interface ClassifiedContent {
  filename: string;
  contentType: ContentType;
  outputTargets: OutputTarget[];
  sections: ContentSection[];
  confidence: number; // 0-1, how confident we are about classification
}

export interface ContentSection {
  title: string;
  content: string;
  type: ContentType;
  outputTarget: OutputTarget;
  hasQuestions: boolean;
  hasAnswers: boolean;
  hasFormulas: boolean;
}

@Injectable()
export class ContentClassifierService {
  private readonly logger = new Logger(ContentClassifierService.name);

  /**
   * Analyze and classify content from a document
   * Determines: type of content + where it should go (Học vs Luyện đề)
   */
  classifyContent(filename: string, content: string): ClassifiedContent {
    const sections = this.splitIntoSections(content);
    const contentType = this.detectContentType(filename, content);
    const outputTargets = this.determineOutputTargets(contentType);

    const classifiedSections = sections.map((section) => {
      const sectionType = this.detectSectionType(section.content);
      return {
        ...section,
        type: sectionType,
        outputTarget: this.getSectionOutputTarget(sectionType),
        hasQuestions: this.hasQuestionPattern(section.content),
        hasAnswers: this.hasAnswerPattern(section.content),
        hasFormulas: this.hasFormulaPattern(section.content),
      };
    });

    return {
      filename,
      contentType,
      outputTargets,
      sections: classifiedSections,
      confidence: this.calculateConfidence(contentType, classifiedSections),
    };
  }

  /**
   * Split content into logical sections (by headings, numbering, or page breaks)
   */
  private splitIntoSections(content: string): { title: string; content: string }[] {
    const sections: { title: string; content: string }[] = [];

    // Split by common heading patterns
    const headingPatterns = [
      /^(Chương|CHƯƠNG)\s*\d+[.:]\s*(.*)/gm,
      /^(Phần|PHẦN)\s*\d+[.:]\s*(.*)/gm,
      /^(Bài|BÀI)\s*\d+[.:]\s*(.*)/gm,
      /^(I{1,3}|IV|V|VI{0,3})[.)]\s*(.*)/gm,
      /^\d+\.\s+[A-ZÀÁẢÃẠ].*$/gm,
    ];

    let lastIndex = 0;
    let lastTitle = 'Nội dung chính';
    const matches: { index: number; title: string }[] = [];

    for (const pattern of headingPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        matches.push({ index: match.index, title: match[0].trim() });
      }
    }

    // Sort by position
    matches.sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
      // No headings found → treat entire content as one section
      return [{ title: 'Nội dung', content: content.trim() }];
    }

    for (const match of matches) {
      if (match.index > lastIndex) {
        const sectionContent = content.slice(lastIndex, match.index).trim();
        if (sectionContent.length > 50) {
          sections.push({ title: lastTitle, content: sectionContent });
        }
      }
      lastTitle = match.title;
      lastIndex = match.index + match.title.length;
    }

    // Last section
    const remaining = content.slice(lastIndex).trim();
    if (remaining.length > 50) {
      sections.push({ title: lastTitle, content: remaining });
    }

    return sections.length > 0 ? sections : [{ title: 'Nội dung', content: content.trim() }];
  }

  /**
   * Detect overall content type from filename + content patterns
   */
  private detectContentType(filename: string, content: string): ContentType {
    const lower = filename.toLowerCase();
    const contentLower = content.toLowerCase().slice(0, 2000);

    // Check filename first
    if (this.hasExamFilePattern(lower)) return 'exam_qa';
    if (this.hasFormulaFilePattern(lower)) return 'formula';
    if (this.hasExerciseFilePattern(lower)) return 'exercise';
    if (this.hasTheoryFilePattern(lower)) return 'theory';

    // Then check content patterns
    const questionDensity = this.calculateQuestionDensity(content);
    if (questionDensity > 0.3) return 'exam_qa'; // >30% content is Q&A
    if (this.hasFormulaPattern(contentLower) && !this.hasQuestionPattern(contentLower)) return 'formula';

    return 'theory'; // Default
  }

  /**
   * Determine output targets based on content type
   * 
   * Rules:
   * - theory → [lesson, quiz] (bài giảng + quiz ôn tập)
   * - formula → [lesson, quiz] (bài giảng + quiz, KHÔNG luyện đề)
   * - exam_qa → [exam] (luyện đề, giữ nguyên)
   * - exercise → [lesson, quiz] (bài mẫu + quiz tương tự)
   */
  private determineOutputTargets(type: ContentType): OutputTarget[] {
    switch (type) {
      case 'theory': return ['lesson', 'quiz'];
      case 'formula': return ['lesson', 'quiz']; // KHÔNG vào exam/luyện đề
      case 'exam_qa': return ['exam']; // Giữ nguyên → luyện đề
      case 'exercise': return ['lesson', 'quiz'];
      case 'mixed': return ['lesson', 'quiz', 'exam'];
      default: return ['lesson'];
    }
  }

  private getSectionOutputTarget(type: ContentType): OutputTarget {
    if (type === 'exam_qa') return 'exam';
    return 'lesson';
  }

  private detectSectionType(content: string): ContentType {
    if (this.calculateQuestionDensity(content) > 0.4) return 'exam_qa';
    if (this.hasFormulaPattern(content) && !this.hasQuestionPattern(content)) return 'formula';
    if (this.hasExercisePattern(content)) return 'exercise';
    return 'theory';
  }

  // === Pattern detection helpers ===

  private hasQuestionPattern(text: string): boolean {
    const patterns = [/Câu\s*\d+/i, /[A-D][.)]\s/, /Đáp án/i, /Chọn.*đúng/i];
    return patterns.some((p) => p.test(text));
  }

  private hasAnswerPattern(text: string): boolean {
    return /Đáp án[:\s]*[A-D]/i.test(text) || /Trả lời[:\s]/i.test(text);
  }

  private hasFormulaPattern(text: string): boolean {
    const patterns = [/công thức/i, /CT[:\s]/i, /=\s*\w+\s*[×÷*/+-]\s*\w+/, /\b[A-Z]\s*=\s*/];
    return patterns.some((p) => p.test(text));
  }

  private hasExercisePattern(text: string): boolean {
    return /Bài (tập|giải)|Giải[:\s]|Lời giải|Hướng dẫn giải/i.test(text);
  }

  private calculateQuestionDensity(text: string): number {
    const questionMatches = text.match(/Câu\s*\d+/gi) || [];
    const lines = text.split('\n').length;
    return lines > 0 ? questionMatches.length / (lines / 5) : 0; // questions per 5 lines
  }

  private hasExamFilePattern(filename: string): boolean {
    return /đáp án|dap an|đề ôn|de on|trắc nghiệm|trac nghiem|all tests|800.cau|view đề|bộ đề|câu hỏi|cau hoi/i.test(filename);
  }

  private hasFormulaFilePattern(filename: string): boolean {
    return /công thức|cong thuc|tóm tắt|tom tat/i.test(filename);
  }

  private hasExerciseFilePattern(filename: string): boolean {
    return /bài tập|bai tap|giải|giai|sưu tầm cách làm/i.test(filename);
  }

  private hasTheoryFilePattern(filename: string): boolean {
    return /lý thuyết|ly thuyet|tài liệu ôn|tai lieu on|ôn tập|on tap/i.test(filename);
  }

  private calculateConfidence(type: ContentType, sections: ContentSection[]): number {
    if (sections.length === 0) return 0.5;
    const matchingCount = sections.filter((s) => s.type === type).length;
    return Math.min(0.95, 0.6 + (matchingCount / sections.length) * 0.35);
  }
}
