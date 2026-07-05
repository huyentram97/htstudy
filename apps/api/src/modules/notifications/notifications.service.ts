import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private readonly repo: Repository<Notification>,
  ) {}

  async findAll(userId: string, query: { page?: number; isRead?: boolean }) {
    const page = query.page || 1;
    const qb = this.repo.createQueryBuilder('n').where('n.user_id = :userId', { userId });
    if (query.isRead !== undefined) qb.andWhere('n.is_read = :isRead', { isRead: query.isRead });
    const [data, total] = await qb.skip((page - 1) * 20).take(20).orderBy('n.created_at', 'DESC').getManyAndCount();
    return { data, meta: { page, pageSize: 20, total, totalPages: Math.ceil(total / 20) } };
  }

  async getUnreadCount(userId: string) {
    return this.repo.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: string) {
    const notif = await this.repo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');
    notif.isRead = true;
    return this.repo.save(notif);
  }

  async markAllAsRead(userId: string) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
  }

  async create(data: { userId: string; tenantId: string; type: string; title: string; body?: string; data?: any }) {
    const notif = this.repo.create({ ...data, expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) });
    return this.repo.save(notif);
  }
}
