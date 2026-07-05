import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoints } from './entities/user-points.entity';
import { PointTransaction } from './entities/point-transaction.entity';
import { Badge } from './entities/badge.entity';
import { DailyMission } from './entities/daily-mission.entity';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(UserPoints) private readonly pointsRepo: Repository<UserPoints>,
    @InjectRepository(PointTransaction) private readonly txRepo: Repository<PointTransaction>,
    @InjectRepository(Badge) private readonly badgeRepo: Repository<Badge>,
    @InjectRepository(DailyMission) private readonly missionRepo: Repository<DailyMission>,
  ) {}

  async getPoints(userId: string) {
    let points = await this.pointsRepo.findOne({ where: { userId } });
    if (!points) {
      points = this.pointsRepo.create({ userId, totalPoints: 0, availablePoints: 0, currentLevel: 1, currentStreakDays: 0, longestStreakDays: 0 });
      points = await this.pointsRepo.save(points);
    }
    return points;
  }

  async awardPoints(userId: string, amount: number, reason: string, refType?: string, refId?: string) {
    const points = await this.getPoints(userId);
    points.totalPoints += amount;
    points.availablePoints += amount;
    await this.pointsRepo.save(points);

    const tx = this.txRepo.create({ userId, type: 'earn', amount, reason, referenceType: refType, referenceId: refId, balanceAfter: points.availablePoints });
    await this.txRepo.save(tx);
    return points;
  }

  async spendPoints(userId: string, amount: number, reason: string, refType?: string, refId?: string) {
    const points = await this.getPoints(userId);
    if (points.availablePoints < amount) {
      throw new BadRequestException(`Insufficient points. Need ${amount}, have ${points.availablePoints}`);
    }
    points.availablePoints -= amount;
    await this.pointsRepo.save(points);

    const tx = this.txRepo.create({ userId, type: 'spend', amount, reason, referenceType: refType, referenceId: refId, balanceAfter: points.availablePoints });
    await this.txRepo.save(tx);
    return points;
  }

  async getTransactions(userId: string, query: { page?: number; type?: string }) {
    const page = query.page || 1;
    const qb = this.txRepo.createQueryBuilder('t').where('t.user_id = :userId', { userId });
    if (query.type) qb.andWhere('t.type = :type', { type: query.type });
    const [data, total] = await qb.skip((page - 1) * 20).take(20).orderBy('t.created_at', 'DESC').getManyAndCount();
    return { data, meta: { page, pageSize: 20, total, totalPages: Math.ceil(total / 20) } };
  }

  async getLeaderboard(tenantId: string, limit = 100) {
    const entries = await this.pointsRepo
      .createQueryBuilder('p')
      .select(['p.userId', 'p.totalPoints', 'p.currentLevel', 'p.currentStreakDays'])
      .orderBy('p.totalPoints', 'DESC')
      .limit(limit)
      .getMany();
    return entries.map((e, idx) => ({ rank: idx + 1, ...e }));
  }

  async getBadges(tenantId: string) {
    return this.badgeRepo.find({ where: { tenantId } });
  }

  async getDailyMissions(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.missionRepo.find({ where: { userId, missionDate: new Date(today) } });
  }

  async updateMissionProgress(missionId: string, increment: number) {
    const mission = await this.missionRepo.findOne({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission not found');
    mission.currentValue = Math.min(mission.currentValue + increment, mission.targetValue);
    if (mission.currentValue >= mission.targetValue) {
      mission.status = 'completed';
      mission.completedAt = new Date();
    }
    return this.missionRepo.save(mission);
  }
}
