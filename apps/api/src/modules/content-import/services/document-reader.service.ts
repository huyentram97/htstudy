import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentReaderService {
  private readonly logger = new Logger(DocumentReaderService.name);

  /**
   * Read content from a file (PDF or DOCX)
   */
  async readFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    try {
      if (ext === '.pdf') {
        return await this.readPdf(filePath);
      } else if (ext === '.docx' || ext === '.doc') {
        return await this.readDocx(filePath);
      } else if (ext === '.txt' || ext === '.csv') {
        return fs.readFileSync(filePath, 'utf-8');
      } else {
        this.logger.warn(`Unsupported format: ${ext} for ${filePath}`);
        return '';
      }
    } catch (error: any) {
      this.logger.error(`Error reading ${filePath}: ${error.message}`);
      return '';
    }
  }

  /**
   * Read PDF file content
   */
  private async readPdf(filePath: string): Promise<string> {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '';
  }

  /**
   * Read DOCX file content
   */
  private async readDocx(filePath: string): Promise<string> {
    const mammoth = require('mammoth');
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }

  /**
   * Read all files in a folder and return content map
   */
  async readAllFiles(folderPath: string): Promise<Map<string, string>> {
    const contentMap = new Map<string, string>();

    if (!fs.existsSync(folderPath)) {
      this.logger.error(`Folder not found: ${folderPath}`);
      return contentMap;
    }

    const files = fs.readdirSync(folderPath);
    for (const filename of files) {
      const ext = path.extname(filename).toLowerCase();
      if (['.pdf', '.docx', '.doc', '.txt'].includes(ext)) {
        const filePath = path.join(folderPath, filename);
        this.logger.log(`Reading: ${filename}`);
        const content = await this.readFile(filePath);
        if (content.trim()) {
          contentMap.set(filename, content);
          this.logger.log(`  → ${content.length} chars extracted`);
        }
      }
    }

    return contentMap;
  }
}
