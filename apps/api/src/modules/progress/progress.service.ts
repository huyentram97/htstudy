import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningProgress } from './entities/learning-progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LearningProgress) private readonly repo: Repository<LearningProgress>,
  ) {}

  async getProgress(userId: string, courseId: string) {
    return this.repo.findOne({ where: { userId, courseId } });
  }

  async saveProgress(userId: string, courseId: string, data: Partial<LearningProgress>) {
    let progress = await this.repo.findOne({ where: { userId, courseId } });
    if (!progress) {
      progress = this.repo.create({ userId, courseId, lastAccessedAt: new Date(), ...data });
    } else {
      Object.assign(progress, data, { lastAccessedAt: new Date() });
    }
    return this.repo.save(progress);
  }

  async getResumeData(userId: string) {
    return this.repo.find({
      where: { userId, status: 'in_progress' },
      order: { lastAccessedAt: 'DESC' },
      take: 5,
    });
  }

  async getAllProgress(userId: string) {
    return this.repo.find({ where: { userId }, order: { lastAccessedAt: 'DESC' } });
  }
}
