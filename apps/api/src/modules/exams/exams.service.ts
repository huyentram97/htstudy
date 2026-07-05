import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { ExamAttempt } from './entities/exam-attempt.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam) private readonly examRepo: Repository<Exam>,
    @InjectRepository(ExamAttempt) private readonly attemptRepo: Repository<ExamAttempt>,
  ) {}

  async findAll(query: { page?: number; pageSize?: number; subjectId?: string; tenantId: string }) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 20, 100);
    const qb = this.examRepo.createQueryBuilder('e').where('e.tenant_id = :tenantId', { tenantId: query.tenantId });
    if (query.subjectId) qb.andWhere('e.subject_id = :subjectId', { subjectId: query.subjectId });
    const [data, total] = await qb.skip((page - 1) * pageSize).take(pageSize).orderBy('e.created_at', 'DESC').getManyAndCount();
    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findById(id: string) {
    const exam = await this.examRepo.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async create(data: Partial<Exam>, userId: string, tenantId: string) {
    const exam = this.examRepo.create({ ...data, createdBy: userId, tenantId });
    return this.examRepo.save(exam);
  }

  async startAttempt(examId: string, userId: string) {
    const exam = await this.findById(examId);
    const attempt = this.attemptRepo.create({ examId, userId, startedAt: new Date(), status: 'in_progress' });
    return this.attemptRepo.save(attempt);
  }

  async submitAttempt(attemptId: string, answers: { questionId: string; selectedOptions: string[] }[]) {
    const attempt = await this.attemptRepo.findOne({ where: { id: attemptId } });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.status !== 'in_progress') throw new BadRequestException('Attempt already submitted');

    // Calculate score (simplified - in production, check against question correct answers)
    const totalQuestions = answers.length;
    const correctCount = Math.floor(totalQuestions * 0.7); // placeholder
    const score = Math.round((correctCount / totalQuestions) * 100);

    const exam = await this.findById(attempt.examId);
    attempt.answers = answers.map((a) => ({ ...a, isCorrect: Math.random() > 0.3 }));
    attempt.score = score;
    attempt.passed = score >= exam.passingScore;
    attempt.durationSeconds = Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000);
    attempt.submittedAt = new Date();
    attempt.status = 'submitted';

    return this.attemptRepo.save(attempt);
  }

  async getAttempts(examId: string, userId: string) {
    return this.attemptRepo.find({ where: { examId, userId }, order: { startedAt: 'DESC' } });
  }
}
