import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeneratedQuestion {
  content: string;
  questionType: 'single_choice' | 'multiple_choice';
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string; // Lời giải chi tiết BẮT BUỘC
  difficulty: 'easy' | 'medium' | 'hard';
}

@Injectable()
export class AIQuizGeneratorService {
  private readonly logger = new Logger(AIQuizGeneratorService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generate quiz questions from knowledge content
   * Kèm lời giải chi tiết cho mỗi câu
   */
  async generateFromKnowledge(content: string, topic: string, count: number = 5): Promise<GeneratedQuestion[]> {
    const prompt = this.buildPrompt(content, 'knowledge', topic, count);
    return this.callAI(prompt);
  }

  /**
   * Generate quiz from formula content
   * KHÔNG vào luyện đề — chỉ bài giảng + quiz
   * Lời giải phải trình bày từng bước tính toán
   */
  async generateFromFormula(content: string, topic: string, count: number = 5): Promise<GeneratedQuestion[]> {
    const prompt = this.buildPrompt(content, 'formula', topic, count);
    return this.callAI(prompt);
  }

  /**
   * Generate similar exercises from solution content
   * Kèm lời giải chi tiết từng bước
   */
  async generateFromExercise(content: string, topic: string, count: number = 3): Promise<GeneratedQuestion[]> {
    const prompt = this.buildPrompt(content, 'exercise', topic, count);
    return this.callAI(prompt);
  }

  private buildPrompt(content: string, type: string, topic: string, count: number): string {
    const typeInstructions: Record<string, string> = {
      knowledge: `Tạo ${count} câu hỏi trắc nghiệm LÝ THUYẾT về "${topic}".
- Tập trung: khái niệm, định nghĩa, so sánh, phân biệt
- Lời giải: giải thích tại sao đáp án đúng, trích dẫn kiến thức liên quan`,

      formula: `Tạo ${count} câu hỏi trắc nghiệm ÁP DỤNG CÔNG THỨC về "${topic}".
- Tập trung: tính toán với số liệu cụ thể, áp dụng công thức
- Lời giải: PHẢI trình bày TỪNG BƯỚC tính toán, ghi rõ công thức sử dụng, thay số, ra kết quả
- VD lời giải: "Áp dụng CT: P = D/(r-g) = 5000/(0.12-0.05) = 71,428 VNĐ. Đáp án B đúng."`,

      exercise: `Tạo ${count} bài tập trắc nghiệm TƯƠNG TỰ về "${topic}".
- Dựa trên mẫu bài tập có sẵn, tạo bài tương tự với số liệu khác
- Lời giải: PHẢI giải CHI TIẾT từng bước, giống như hướng dẫn giải cho sinh viên`,
    };

    return `Bạn là giảng viên chuyên ngành Tài chính - Chứng khoán.

${typeInstructions[type]}

YÊU CẦU BẮT BUỘC:
1. Mỗi câu hỏi có 4 đáp án (A, B, C, D), chỉ 1 đáp án đúng
2. MỖI CÂU PHẢI CÓ LỜI GIẢI CHI TIẾT (trường "explanation")
3. Lời giải tối thiểu 2-3 dòng, giải thích rõ ràng
4. Phân bố độ khó: easy(30%), medium(50%), hard(20%)
5. Ngôn ngữ: Tiếng Việt

OUTPUT FORMAT (JSON array):
[
  {
    "content": "Câu hỏi...",
    "options": [
      {"id": "A", "text": "...", "isCorrect": false},
      {"id": "B", "text": "...", "isCorrect": true},
      {"id": "C", "text": "...", "isCorrect": false},
      {"id": "D", "text": "...", "isCorrect": false}
    ],
    "explanation": "Lời giải chi tiết: ... Bước 1:... Bước 2:... Vậy đáp án đúng là B.",
    "difficulty": "medium"
  }
]

NỘI DUNG NGUỒN:
${content.slice(0, 8000)}`;
  }

  private async callAI(prompt: string): Promise<GeneratedQuestion[]> {
    const apiKey = this.configService.get('OPENAI_API_KEY');

    if (!apiKey || apiKey === 'your-key-here') {
      this.logger.warn('OpenAI API key not configured. Returning empty questions.');
      return [];
    }

    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL', 'gpt-4o-mini'),
        messages: [
          { role: 'system', content: 'You are a Vietnamese finance/securities education expert. Always respond in valid JSON array format.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const text = response.choices[0]?.message?.content || '[]';
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      const questions = JSON.parse(jsonMatch[0]);
      return questions.map((q: any) => ({
        content: q.content,
        questionType: 'single_choice' as const,
        options: q.options,
        explanation: q.explanation || 'Chưa có lời giải',
        difficulty: q.difficulty || 'medium',
      }));
    } catch (error: any) {
      this.logger.error(`AI generation failed: ${error.message}`);
      return [];
    }
  }
}
