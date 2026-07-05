import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private readonly repo: Repository<Question>,
  ) {}

  async findAll(query: { page?: number; pageSize?: number; subjectId?: string; difficulty?: string; status?: string; tenantId: string }) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 20, 100);
    const qb = this.repo.createQueryBuilder('q').where('q.tenant_id = :tenantId', { tenantId: query.tenantId });

    if (query.subjectId) qb.andWhere('q.subject_id = :subjectId', { subjectId: query.subjectId });
    if (query.difficulty) qb.andWhere('q.difficulty = :difficulty', { difficulty: query.difficulty });
    if (query.status) qb.andWhere('q.status = :status', { status: query.status });

    const [data, total] = await qb.skip((page - 1) * pageSize).take(pageSize).orderBy('q.created_at', 'DESC').getManyAndCount();
    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }

  async findById(id: string) {
    const q = await this.repo.findOne({ where: { id } });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async create(data: Partial<Question>, userId: string, tenantId: string) {
    if (!data.content || !data.options || data.options.length < 2) {
      throw new BadRequestException('Content and at least 2 options are required');
    }
    const question = this.repo.create({ ...data, createdBy: userId, tenantId, status: 'draft' });
    return this.repo.save(question);
  }

  async approve(id: string, userId: string) {
    const q = await this.findById(id);
    q.status = 'approved';
    q.approvedBy = userId;
    return this.repo.save(q);
  }

  async reject(id: string) {
    const q = await this.findById(id);
    q.status = 'rejected';
    return this.repo.save(q);
  }

  async delete(id: string) {
    const q = await this.findById(id);
    await this.repo.remove(q);
  }
}
