import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ParsedFile {
  filename: string;
  format: string;
  category: 'exam_with_answers' | 'knowledge' | 'formula' | 'exercise' | 'question_bank' | 'skip';
  content: string;
  metadata: {
    pageCount?: number;
    wordCount?: number;
  };
}

@Injectable()
export class FileParserService {
  /**
   * Classify file by name pattern into categories
   */
  classifyFile(filename: string): ParsedFile['category'] {
    const lower = filename.toLowerCase();
    const ext = path.extname(filename).toLowerCase();

    // Skip backup files
    if (ext === '.wbk' || lower.includes('backup of')) return 'skip';

    // Files with exam answers
    if (
      lower.includes('đáp án') ||
      lower.includes('dap an') ||
      lower.includes('đề ôn thi') ||
      lower.includes('de on thi') ||
      lower.includes('trắc nghiệm') ||
      lower.includes('trac nghiem') ||
      lower.includes('all tests') ||
      lower.includes('câu hỏi') ||
      lower.includes('cau hoi') ||
      lower.includes('800_cau') ||
      lower.includes('view đề') ||
      lower.includes('bộ đề')
    ) {
      return 'exam_with_answers';
    }

    // Formula/summary files
    if (
      lower.includes('công thức') ||
      lower.includes('cong thuc') ||
      lower.includes('tóm tắt') ||
      lower.includes('tom tat')
    ) {
      return 'formula';
    }

    // Exercise/solution files
    if (
      lower.includes('bài tập') ||
      lower.includes('bai tap') ||
      lower.includes('giải') ||
      lower.includes('giai') ||
      lower.includes('sưu tầm cách làm')
    ) {
      return 'exercise';
    }

    // Question bank files
    if (
      lower.includes('tổng hợp câu') ||
      lower.includes('tong hop cau') ||
      lower.includes('các câu vào') ||
      lower.includes('câu hỏi học')
    ) {
      return 'question_bank';
    }

    // Knowledge/theory files
    if (
      lower.includes('lý thuyết') ||
      lower.includes('ly thuyet') ||
      lower.includes('tài liệu ôn') ||
      lower.includes('tai lieu on') ||
      lower.includes('ôn tập') ||
      lower.includes('on tap')
    ) {
      return 'knowledge';
    }

    // Default: treat as knowledge
    return 'knowledge';
  }

  /**
   * Get file extension
   */
  getFormat(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const formatMap: Record<string, string> = {
      '.pdf': 'pdf',
      '.docx': 'docx',
      '.doc': 'doc',
      '.xlsx': 'xlsx',
      '.xls': 'xls',
      '.pptx': 'pptx',
      '.csv': 'csv',
      '.txt': 'txt',
      '.wbk': 'wbk',
    };
    return formatMap[ext] || 'unknown';
  }

  /**
   * Scan a subject folder and classify all files
   */
  scanSubjectFolder(folderPath: string): ParsedFile[] {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs.readdirSync(folderPath);
    return files.map((filename) => {
      const format = this.getFormat(filename);
      const category = this.classifyFile(filename);
      return {
        filename,
        format,
        category,
        content: '', // Content will be extracted by document parsers
        metadata: {},
      };
    }).filter((f) => f.category !== 'skip');
  }
}
