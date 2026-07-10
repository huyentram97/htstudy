import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findChaptersWithLessons(courseId: string) {
    const { rows } = await this.courseRepository.query(`
      SELECT ch.id, ch.title, ch.description, ch.sort_order,
        COALESCE(json_agg(
          json_build_object('id', l.id, 'title', l.title, 'contentType', l.content_type, 'sortOrder', l.sort_order)
          ORDER BY l.sort_order
        ) FILTER (WHERE l.id IS NOT NULL), '[]') as lessons
      FROM chapters ch
      LEFT JOIN lessons l ON l.chapter_id = ch.id
      WHERE ch.course_id = $1
      GROUP BY ch.id, ch.title, ch.description, ch.sort_order
      ORDER BY ch.sort_order
    `, [courseId]);
    return rows;
  }

  async findLessonById(lessonId: string) {
    const rows = await this.courseRepository.query(
      `SELECT id, title, content_type as "contentType", content, sort_order as "sortOrder" FROM lessons WHERE id = $1`,
      [lessonId]
    );
    return rows[0] || null;
  }

  async findAll(query: {
    page?: number;
    pageSize?: number;
    subjectId?: string;
    status?: string;
    accessType?: string;
  }) {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 20, 100);
    const skip = (page - 1) * pageSize;

    const qb = this.courseRepository.createQueryBuilder('course');

    if (query.subjectId) {
      qb.andWhere('course.subject_id = :subjectId', { subjectId: query.subjectId });
    }
    if (query.status) {
      qb.andWhere('course.status = :status', { status: query.status });
    }
    if (query.accessType) {
      qb.andWhere('course.access_type = :accessType', { accessType: query.accessType });
    }

    qb.orderBy('course.created_at', 'DESC');

    const [data, total] = await qb.skip(skip).take(pageSize).getManyAndCount();

    return {
      data,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async create(data: Partial<Course>, userId: string, tenantId: string): Promise<Course> {
    const course = this.courseRepository.create({
      ...data,
      tenantId,
      createdBy: userId,
      status: 'draft',
    });
    return this.courseRepository.save(course);
  }

  async submitForReview(id: string, userId: string): Promise<Course> {
    const course = await this.findById(id);
    if (course.status !== 'draft' && course.status !== 'rejected') {
      throw new BadRequestException('Course can only be submitted from draft or rejected status');
    }
    course.status = 'pending_review';
    return this.courseRepository.save(course);
  }

  async approve(id: string, reviewerId: string): Promise<Course> {
    const course = await this.findById(id);
    if (course.status !== 'pending_review') {
      throw new BadRequestException('Course must be in pending_review status to approve');
    }
    if (course.createdBy === reviewerId) {
      throw new BadRequestException('Maker cannot approve their own content');
    }
    course.status = 'published';
    course.reviewedBy = reviewerId;
    course.publishedAt = new Date();
    return this.courseRepository.save(course);
  }

  async reject(id: string, reviewerId: string, reason: string): Promise<Course> {
    const course = await this.findById(id);
    if (course.status !== 'pending_review') {
      throw new BadRequestException('Course must be in pending_review status to reject');
    }
    if (!reason || reason.length < 10) {
      throw new BadRequestException('Rejection reason must be at least 10 characters');
    }
    course.status = 'rejected';
    course.reviewedBy = reviewerId;
    return this.courseRepository.save(course);
  }
}
