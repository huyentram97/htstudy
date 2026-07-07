import { Injectable, Logger } from '@nestjs/common';

export interface DeduplicationResult {
  uniqueItems: any[];
  duplicates: { item: any; similarTo: string; similarity: number }[];
  totalInput: number;
  totalUnique: number;
  totalDuplicates: number;
}

@Injectable()
export class DeduplicationService {
  private readonly logger = new Logger(DeduplicationService.name);

  /**
   * Remove duplicate questions based on content similarity
   * Uses normalized text comparison + Jaccard similarity
   */
  deduplicateQuestions(questions: { content: string; [key: string]: any }[]): DeduplicationResult {
    const unique: any[] = [];
    const duplicates: { item: any; similarTo: string; similarity: number }[] = [];

    for (const question of questions) {
      const normalizedContent = this.normalize(question.content);

      // Check against all unique items
      let isDuplicate = false;
      for (const existing of unique) {
        const similarity = this.calculateSimilarity(normalizedContent, this.normalize(existing.content));
        if (similarity > 0.85) { // 85% similarity = duplicate
          duplicates.push({ item: question, similarTo: existing.content.slice(0, 80), similarity });
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        unique.push(question);
      }
    }

    this.logger.log(`Deduplication: ${questions.length} → ${unique.length} unique, ${duplicates.length} duplicates`);

    return {
      uniqueItems: unique,
      duplicates,
      totalInput: questions.length,
      totalUnique: unique.length,
      totalDuplicates: duplicates.length,
    };
  }

  /**
   * Deduplicate knowledge content sections (avoid duplicate lessons)
   */
  deduplicateContent(sections: { title: string; content: string }[]): DeduplicationResult {
    const unique: any[] = [];
    const duplicates: { item: any; similarTo: string; similarity: number }[] = [];

    for (const section of sections) {
      const normalizedContent = this.normalize(section.content);
      let isDuplicate = false;

      for (const existing of unique) {
        // For content, use lower threshold since same topic may appear in different files
        const titleSim = this.calculateSimilarity(this.normalize(section.title), this.normalize(existing.title));
        const contentSim = this.calculateSimilarity(normalizedContent, this.normalize(existing.content));

        // Duplicate if title 70%+ similar AND content 60%+ similar
        if (titleSim > 0.7 && contentSim > 0.6) {
          // Keep the longer version (more complete)
          if (section.content.length > existing.content.length) {
            const idx = unique.indexOf(existing);
            unique[idx] = section;
            duplicates.push({ item: existing, similarTo: section.title, similarity: contentSim });
          } else {
            duplicates.push({ item: section, similarTo: existing.title, similarity: contentSim });
          }
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        unique.push(section);
      }
    }

    return {
      uniqueItems: unique,
      duplicates,
      totalInput: sections.length,
      totalUnique: unique.length,
      totalDuplicates: duplicates.length,
    };
  }

  /**
   * Normalize text for comparison: lowercase, remove extra spaces, punctuation
   */
  private normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[.,;:!?()[\]{}"']/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Calculate Jaccard similarity between two strings
   * (based on word n-grams)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    if (!text1 || !text2) return 0;

    const words1 = new Set(this.getNgrams(text1, 3));
    const words2 = new Set(this.getNgrams(text2, 3));

    if (words1.size === 0 || words2.size === 0) return 0;

    let intersection = 0;
    for (const word of words1) {
      if (words2.has(word)) intersection++;
    }

    const union = words1.size + words2.size - intersection;
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Get character n-grams from text
   */
  private getNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.slice(i, i + n));
    }
    return ngrams;
  }
}
