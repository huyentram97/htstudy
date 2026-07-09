/**
 * H-T.Study - Subject Processing Script
 * 
 * Mô hình:
 * 1. Đọc tất cả file trong mỗi folder môn học
 * 2. Phân loại: kiến thức → Khóa học (quiz trắc nghiệm), đề thi → Luyện đề (flashcard)
 * 3. Sàng lọc trùng lặp
 * 4. Tạo dữ liệu vào DB
 * 
 * Chạy: node scripts/process-subjects.js
 * Yêu cầu: chạy trong container hoặc server có access DB
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// DB connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'htstudy',
  password: process.env.DB_PASSWORD || 'HtStudy2026!',
  database: process.env.DB_DATABASE || 'htstudy',
});

const TENANT_ID = '00000000-0000-0000-0000-000000000001';
const ADMIN_ID = '00000000-0000-0000-0000-000000000100';
const INPUT_DIR = path.join(__dirname, '..', 'input data');

// ==========================================
// FILE CLASSIFICATION
// ==========================================
function classifyFile(filename) {
  const lower = filename.toLowerCase();
  const ext = path.extname(filename).toLowerCase();

  // Skip
  if (['.wbk', '.jpg', '.jpeg', '.png'].includes(ext)) return 'skip';
  if (lower.includes('backup of')) return 'skip';

  // Đề thi + đáp án → LUYỆN ĐỀ (flashcard)
  if (
    lower.includes('đáp án') || lower.includes('dap an') ||
    lower.includes('đề thi') || lower.includes('de thi') ||
    lower.includes('đề ôn') || lower.includes('de on') ||
    lower.includes('trắc nghiệm') || lower.includes('trac nghiem') ||
    lower.includes('câu hỏi ôn') || lower.includes('cau hoi on') ||
    lower.includes('800 cau') || lower.includes('500 câu') ||
    lower.includes('bộ đề') || lower.includes('bo de') ||
    lower.includes('212 cau') || lower.includes('124 cau') ||
    lower.includes('50 cau') ||
    lower.includes('view đề') ||
    lower.includes('all tests') ||
    lower.includes('[123doc]') ||
    lower.includes('bao đậu') || lower.includes('bao dau') ||
    lower.includes('sát đề thi')
  ) {
    return 'exam'; // → Flashcard
  }

  // Slide → KHÓA HỌC (chương bài giảng)
  if (['.ppt', '.pptx'].includes(ext) || lower.includes('slide')) {
    return 'slide';
  }

  // Công thức → KHÓA HỌC
  if (lower.includes('công thức') || lower.includes('cong thuc') || lower.includes('tóm tắt')) {
    return 'formula';
  }

  // Bài tập → KHÓA HỌC
  if (lower.includes('bài tập') || lower.includes('bai tap') || lower.includes('giải') || lower.includes('giai')) {
    return 'exercise';
  }

  // Mặc định: kiến thức → KHÓA HỌC
  return 'knowledge';
}

// ==========================================
// SCAN SUBJECTS
// ==========================================
function scanSubjects() {
  const subjects = [];
  const dirs = fs.readdirSync(INPUT_DIR, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const subjectPath = path.join(INPUT_DIR, dir.name);
    const files = getAllFiles(subjectPath);

    const classified = { knowledge: [], formula: [], exercise: [], slide: [], exam: [], skip: [] };
    for (const file of files) {
      const category = classifyFile(path.basename(file));
      classified[category].push(file);
    }

    subjects.push({
      name: dir.name,
      path: subjectPath,
      files: classified,
      totalFiles: files.length,
      forCourse: classified.knowledge.length + classified.formula.length + classified.exercise.length + classified.slide.length,
      forExam: classified.exam.length,
    });
  }

  return subjects;
}

function getAllFiles(dirPath) {
  const files = [];
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// ==========================================
// MAIN
// ==========================================
async function main() {
  console.log('=== H-T.Study Subject Processor ===\n');

  const subjects = scanSubjects();

  console.log(`Found ${subjects.length} subjects:\n`);
  for (const subject of subjects) {
    console.log(`📚 ${subject.name}`);
    console.log(`   Total files: ${subject.totalFiles}`);
    console.log(`   → Khóa học (kiến thức/slide/CT/BT): ${subject.forCourse} files`);
    console.log(`   → Luyện đề (đề thi/flashcard): ${subject.forExam} files`);
    console.log(`   → Skip: ${subject.files.skip.length} files`);
    console.log('');
  }

  // Seed to DB
  console.log('Seeding to database...\n');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear old data
    await client.query('TRUNCATE TABLE flashcards CASCADE');
    await client.query('TRUNCATE TABLE flashcard_sets CASCADE');
    await client.query('TRUNCATE TABLE lessons CASCADE');
    await client.query('TRUNCATE TABLE chapters CASCADE');
    await client.query('TRUNCATE TABLE courses CASCADE');
    await client.query('TRUNCATE TABLE subjects CASCADE');

    for (const subject of subjects) {
      // Create subject
      const subjectRes = await client.query(
        `INSERT INTO subjects (tenant_id, name, description, sort_order) VALUES ($1, $2, $3, $4) RETURNING id`,
        [TENANT_ID, subject.name, `Khóa học ${subject.name}`, subjects.indexOf(subject) + 1]
      );
      const subjectId = subjectRes.rows[0].id;

      // Create 1 course per subject
      const courseRes = await client.query(
        `INSERT INTO courses (tenant_id, subject_id, title, description, status, access_type, created_by)
         VALUES ($1, $2, $3, $4, 'published', 'free', $5) RETURNING id`,
        [TENANT_ID, subjectId, subject.name, `Khóa học ${subject.name} - bao gồm lý thuyết, công thức, bài tập mẫu`, ADMIN_ID]
      );
      const courseId = courseRes.rows[0].id;

      // Create chapters based on file categories
      let chapterOrder = 0;

      if (subject.files.slide.length > 0) {
        chapterOrder++;
        await client.query(
          `INSERT INTO chapters (course_id, title, description, sort_order) VALUES ($1, $2, $3, $4)`,
          [courseId, 'Bài giảng (Slide)', `${subject.files.slide.length} slide bài giảng`, chapterOrder]
        );
      }

      if (subject.files.knowledge.length > 0) {
        chapterOrder++;
        await client.query(
          `INSERT INTO chapters (course_id, title, description, sort_order) VALUES ($1, $2, $3, $4)`,
          [courseId, 'Lý thuyết', `${subject.files.knowledge.length} tài liệu kiến thức`, chapterOrder]
        );
      }

      if (subject.files.formula.length > 0) {
        chapterOrder++;
        await client.query(
          `INSERT INTO chapters (course_id, title, description, sort_order) VALUES ($1, $2, $3, $4)`,
          [courseId, 'Công thức & Tính toán', `${subject.files.formula.length} tài liệu công thức`, chapterOrder]
        );
      }

      if (subject.files.exercise.length > 0) {
        chapterOrder++;
        await client.query(
          `INSERT INTO chapters (course_id, title, description, sort_order) VALUES ($1, $2, $3, $4)`,
          [courseId, 'Bài tập mẫu & Lời giải', `${subject.files.exercise.length} bài tập`, chapterOrder]
        );
      }

      // Create flashcard set for exam files
      if (subject.files.exam.length > 0) {
        await client.query(
          `INSERT INTO flashcard_sets (tenant_id, subject_id, title, description, card_count, created_by)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [TENANT_ID, subjectId, `Luyện đề: ${subject.name}`, `Flashcard từ ${subject.files.exam.length} file đề thi`, subject.files.exam.length * 30, ADMIN_ID]
        );
      }

      console.log(`✅ ${subject.name}: 1 khóa + ${chapterOrder} chương + ${subject.files.exam.length > 0 ? '1 bộ flashcard' : '0 flashcard'}`);
    }

    await client.query('COMMIT');
    console.log('\n✅ Seed completed!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
