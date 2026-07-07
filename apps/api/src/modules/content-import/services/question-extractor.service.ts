import { Injectable } from '@nestjs/common';

export interface ExtractedQuestion {
  content: string;
  questionType: 'single_choice' | 'multiple_choice';
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string; // Lời giải chi tiết
  difficulty: 'easy' | 'medium' | 'hard';
  source: 'original' | 'ai_generated';
  category: 'exam' | 'quiz'; // exam = luyện đề, quiz = ôn tập trong bài giảng
}

@Injectable()
export class QuestionExtractorService {
  /**
   * Extract questions from files that already have Q&A (đề + đáp án)
   * → Output: Luyện đề (giữ nguyên)
   */
  extractExistingQuestions(content: string): ExtractedQuestion[] {
    const questions: ExtractedQuestion[] = [];

    // Pattern 1: "Câu 1: ... A. ... B. ... C. ... D. ... Đáp án: A"
    const pattern = /Câu\s*(\d+)[.:]\s*(.*?)(?=Câu\s*\d+[.:]|$)/gs;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const questionBlock = match[2].trim();
      const parsed = this.parseQuestionBlock(questionBlock);
      if (parsed) {
        questions.push({
          ...parsed,
          source: 'original',
          category: 'exam', // Đề có sẵn → vào luyện đề
        });
      }
    }

    return questions;
  }

  /**
   * Generate quiz questions from knowledge content
   * → Output: Quiz trong bài giảng (KHÔNG vào luyện đề)
   * → Kèm lời giải chi tiết
   */
  generateQuizFromKnowledge(content: string, topic: string): ExtractedQuestion[] {
    // This will call AI (OpenAI) to generate questions
    // For now, return structure template
    // AI prompt will include: "Sinh câu hỏi ôn tập kèm LỜI GIẢI CHI TIẾT"
    return [];
  }

  /**
   * Generate quiz from formula content
   * → Output: Quiz trong bài giảng (KHÔNG vào luyện đề)
   * → Kèm lời giải chi tiết (hướng dẫn áp dụng công thức)
   */
  generateQuizFromFormula(content: string): ExtractedQuestion[] {
    // AI will generate application questions from formulas
    // Each question MUST have detailed explanation showing formula application steps
    return [];
  }

  /**
   * Generate quiz from exercise/solution content
   * → Output: Bài giảng (bài mẫu) + Quiz
   * → Kèm lời giải chi tiết từng bước
   */
  generateFromExercise(content: string): ExtractedQuestion[] {
    // Parse existing solutions as lesson content
    // Generate similar questions with step-by-step explanation
    return [];
  }

  /**
   * AI Prompt template for generating questions with detailed explanations
   */
  getAIPrompt(content: string, type: 'knowledge' | 'formula' | 'exercise'): string {
    const basePrompt = `Dựa trên nội dung sau, hãy tạo câu hỏi trắc nghiệm ôn tập.

YÊU CẦU BẮT BUỘC:
- Mỗi câu hỏi PHẢI có LỜI GIẢI CHI TIẾT (explanation)
- Lời giải phải giải thích TẠI SAO đáp án đó đúng
- Lời giải phải chỉ ra CÁC BƯỚC suy luận
- Ngôn ngữ: Tiếng Việt

FORMAT OUTPUT (JSON):
{
  "questions": [
    {
      "content": "Nội dung câu hỏi",
      "options": [
        {"id": "A", "text": "Đáp án A", "isCorrect": false},
        {"id": "B", "text": "Đáp án B", "isCorrect": true},
        {"id": "C", "text": "Đáp án C", "isCorrect": false},
        {"id": "D", "text": "Đáp án D", "isCorrect": false}
      ],
      "explanation": "Lời giải chi tiết: Đáp án B đúng vì... Bước 1:... Bước 2:...",
      "difficulty": "medium"
    }
  ]
}`;

    const typeSpecific: Record<string, string> = {
      knowledge: `\nLoại: Câu hỏi lý thuyết. Tập trung vào khái niệm, định nghĩa, so sánh.`,
      formula: `\nLoại: Câu hỏi áp dụng công thức. Lời giải PHẢI trình bày từng bước tính toán với số liệu cụ thể.`,
      exercise: `\nLoại: Bài tập ứng dụng. Tạo bài tập tương tự với lời giải từng bước chi tiết.`,
    };

    return basePrompt + typeSpecific[type] + `\n\nNỘI DUNG:\n${content}`;
  }

  /**
   * Parse a question block (internal helper)
   */
  private parseQuestionBlock(block: string): Omit<ExtractedQuestion, 'source' | 'category'> | null {
    // Extract question text
    const optionPattern = /([A-D])[.)]\s*(.*?)(?=[A-D][.)]\s|Đáp án|$)/gs;
    const answerPattern = /Đáp án[:\s]*([A-D])/i;

    const lines = block.split('\n');
    const questionText = lines[0]?.trim();
    if (!questionText) return null;

    const options: { id: string; text: string; isCorrect: boolean }[] = [];
    let correctAnswer = '';

    // Find correct answer
    const answerMatch = block.match(answerPattern);
    if (answerMatch) correctAnswer = answerMatch[1].toUpperCase();

    // Extract options
    let optMatch;
    while ((optMatch = optionPattern.exec(block)) !== null) {
      const id = optMatch[1].toUpperCase();
      options.push({
        id,
        text: optMatch[2].trim(),
        isCorrect: id === correctAnswer,
      });
    }

    if (options.length < 2) return null;

    // Extract explanation if exists
    const explPattern = /(?:Giải thích|Lời giải|Explanation)[:\s]*(.*?)(?=Câu\s*\d+|$)/is;
    const explMatch = block.match(explPattern);
    const explanation = explMatch ? explMatch[1].trim() : `Đáp án đúng: ${correctAnswer}`;

    return {
      content: questionText,
      questionType: 'single_choice',
      options,
      explanation,
      difficulty: 'medium',
    };
  }
}
