/**
 * H-T.Study - Import Content from files
 * 
 * 1. Đọc file PDF/DOCX trong mỗi môn
 * 2. Tạo bài học (lessons) trong từng chương
 * 3. Tạo flashcard từ file đề thi
 * 
 * Chạy: docker run --rm -v /opt/htstudy:/app -w /app --network host node:20-alpine sh -c "npm install pg pdf-parse mammoth --no-save && node scripts/import-content.js"
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'htstudy',
  password: process.env.DB_PASSWORD || 'HtStudy2026!',
  database: process.env.DB_DATABASE || 'htstudy',
});

const INPUT_DIR = path.join(__dirname, '..', 'input data');

// ==========================================
// FILE READERS
// ==========================================
async function readPdf(filePath) {
  try {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (e) {
    console.log(`  ⚠️ Cannot read PDF: ${path.basename(filePath)} - ${e.message}`);
    return '';
  }
}

async function readDocx(filePath) {
  try {
    const mammoth = require('mammoth');
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (e) {
    console.log(`  ⚠️ Cannot read DOCX: ${path.basename(filePath)} - ${e.message}`);
    return '';
  }
}

async function readFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') return readPdf(filePath);
  if (['.docx', '.doc'].includes(ext)) return readDocx(filePath);
  if (ext === '.txt') return fs.readFileSync(filePath, 'utf-8');
  return '';
}

// ==========================================
// CLASSIFY
// ==========================================
function classifyFile(filename) {
  const lower = filename.toLowerCase();
  const ext = path.extname(filename).toLowerCase();
  if (['.wbk', '.jpg', '.jpeg', '.png', '.ppt', '.pptx'].includes(ext)) return 'skip';
  if (lower.includes('backup of')) return 'skip';

  if (
    lower.includes('đáp án') || lower.includes('dap an') ||
    lower.includes('đề thi') || lower.includes('de thi') ||
    lower.includes('đề ôn') || lower.includes('de on') ||
    lower.includes('trắc nghiệm') || lower.includes('trac nghiem') ||
    lower.includes('câu hỏi ôn') || lower.includes('cau hoi on') ||
    lower.includes('800 cau') || lower.includes('500 câu') ||
    lower.includes('212 cau') || lower.includes('124 cau') ||
    lower.includes('50 cau') || lower.includes('bộ đề') ||
    lower.includes('all tests') || lower.includes('[123doc]') ||
    lower.includes('bao đậu') || lower.includes('sát đề thi') ||
    lower.includes('view đề')
  ) return 'exam';

  if (lower.includes('công thức') || lower.includes('tóm tắt')) return 'formula';
  if (lower.includes('bài tập') || lower.includes('giải')) return 'exercise';
  return 'knowledge';
}

// ==========================================
// EXTRACT FLASHCARDS from exam content
// ==========================================
function extractFlashcards(content, filename) {
  const cards = [];
  // Pattern: Câu N: ... A. ... B. ... C. ... D. ... Đáp án: X
  const questionPattern = /Câu\s*(\d+)[.:]\s*([\s\S]*?)(?=Câu\s*\d+[.:]|$)/gi;
  let match;

  while ((match = questionPattern.exec(content)) !== null) {
    const block = match[2].trim();
    if (block.length < 20) continue;

    // Extract question text (before options)
    const optionStart = block.search(/\n\s*[A-D][.)]\s/);
    const questionText = optionStart > 0 ? block.slice(0, optionStart).trim() : block.slice(0, 200).trim();

    // Extract answer
    const answerMatch = block.match(/Đáp án[:\s]*([A-D])/i);
    const answer = answerMatch ? answerMatch[1] : '';

    // Extract the correct option text
    let answerText = answer;
    if (answer) {
      const optPattern = new RegExp(`${answer}[.)\\s]\\s*(.+?)(?=\\n|[A-D][.)\\s]|Đáp án|$)`, 'i');
      const optMatch = block.match(optPattern);
      if (optMatch) answerText = `${answer}. ${optMatch[1].trim()}`;
    }

    if (questionText.length > 10) {
      cards.push({
        front: questionText.slice(0, 500),
        back: answerText || 'Xem đáp án trong tài liệu gốc',
      });
    }
  }

  // If no pattern found, split by numbered lines
  if (cards.length === 0) {
    const lines = content.split('\n').filter(l => l.trim().length > 20);
    for (let i = 0; i < Math.min(lines.length, 50); i += 2) {
      if (lines[i] && lines[i + 1]) {
        cards.push({ front: lines[i].trim().slice(0, 500), back: lines[i + 1].trim().slice(0, 500) });
      }
    }
  }

  return cards.slice(0, 100); // Max 100 cards per file
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  console.log('=== H-T.Study Content Importer ===\n');

  const client = await pool.connect();
  let totalLessons = 0;
  let totalCards = 0;

  try {
    // Get all courses with chapters
    const coursesRes = await client.query(`
      SELECT c.id as course_id, c.title as course_title, s.name as subject_name,
             ch.id as chapter_id, ch.title as chapter_title, ch.sort_order
      FROM courses c
      JOIN subjects s ON c.subject_id = s.id
      JOIN chapters ch ON ch.course_id = c.id
      ORDER BY s.sort_order, ch.sort_order
    `);

    // Get flashcard sets
    const flashcardSetsRes = await client.query(`SELECT id, title, subject_id FROM flashcard_sets`);

    // Group chapters by subject
    const subjectChapters = {};
    for (const row of coursesRes.rows) {
      if (!subjectChapters[row.subject_name]) subjectChapters[row.subject_name] = [];
      subjectChapters[row.subject_name].push(row);
    }

    // Process each subject folder
    const dirs = fs.readdirSync(INPUT_DIR, { withFileTypes: true }).filter(d => d.isDirectory());

    for (const dir of dirs) {
      const subjectName = dir.name;
      const subjectPath = path.join(INPUT_DIR, subjectName);
      console.log(`\n📚 Processing: ${subjectName}`);

      const chapters = subjectChapters[subjectName] || [];
      if (chapters.length === 0) { console.log('  ⚠️ No chapters found in DB'); continue; }

      // Get all files recursively
      const allFiles = getAllFiles(subjectPath);
      let lessonOrder = 0;
      let examCards = [];

      for (const filePath of allFiles) {
        const filename = path.basename(filePath);
        const category = classifyFile(filename);
        if (category === 'skip') continue;

        console.log(`  Reading: ${filename} [${category}]`);
        const content = await readFile(filePath);
        if (!content || content.length < 50) { console.log('    → Empty/too short, skip'); continue; }

        if (category === 'exam') {
          // Extract flashcards
          const cards = extractFlashcards(content, filename);
          examCards.push(...cards);
          console.log(`    → ${cards.length} flashcards extracted`);
        } else {
          // Create lesson in appropriate chapter
          let targetChapter;
          if (category === 'formula') targetChapter = chapters.find(c => c.chapter_title.includes('Công thức'));
          else if (category === 'exercise') targetChapter = chapters.find(c => c.chapter_title.includes('Bài tập'));
          else targetChapter = chapters.find(c => c.chapter_title.includes('Lý thuyết') || c.chapter_title.includes('Bài giảng'));

          if (!targetChapter) targetChapter = chapters[0]; // fallback to first chapter

          lessonOrder++;
          const title = filename.replace(/\.(pdf|docx|doc|txt)$/i, '').replace(/^\d+[\s._-]*/, '').trim();
          const lessonContent = content.slice(0, 10000); // Max 10K chars per lesson

          await client.query(
            `INSERT INTO lessons (chapter_id, title, content_type, content, sort_order)
             VALUES ($1, $2, 'text', $3, $4)`,
            [targetChapter.chapter_id, title.slice(0, 300), JSON.stringify({ text: lessonContent }), lessonOrder]
          );
          totalLessons++;
          console.log(`    → Lesson created: ${title.slice(0, 50)}`);
        }
      }

      // Save flashcards
      if (examCards.length > 0) {
        // Deduplicate
        const seen = new Set();
        const uniqueCards = examCards.filter(card => {
          const key = card.front.slice(0, 50).toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Find flashcard set for this subject
        const subjectRes = await client.query(`SELECT id FROM subjects WHERE name = $1`, [subjectName]);
        if (subjectRes.rows.length > 0) {
          const fcSet = flashcardSetsRes.rows.find(s => s.subject_id === subjectRes.rows[0].id);
          if (fcSet) {
            for (let i = 0; i < uniqueCards.length; i++) {
              await client.query(
                `INSERT INTO flashcards (set_id, front_content, back_content, sort_order) VALUES ($1, $2, $3, $4)`,
                [fcSet.id, uniqueCards[i].front, uniqueCards[i].back, i + 1]
              );
            }
            // Update card count
            await client.query(`UPDATE flashcard_sets SET card_count = $1 WHERE id = $2`, [uniqueCards.length, fcSet.id]);
            totalCards += uniqueCards.length;
            console.log(`  📝 ${uniqueCards.length} flashcards saved (deduplicated from ${examCards.length})`);
          }
        }
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Lessons created: ${totalLessons}`);
    console.log(`   Flashcards created: ${totalCards}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

function getAllFiles(dirPath) {
  const files = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) files.push(...getAllFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

main();
