import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>,
  ) {}

  async log(data: { tenantId: string; userId?: string; username?: string; actionType: string; resourceType: string; resourceId?: string; ipAddress?: string; previousValue?: any; newValue?: any; metadata?: any }) {
    const entry = this.repo.create(data);
    return this.repo.save(entry);
  }

  async findAll(tenantId: string, query: { page?: number; userId?: string; actionType?: string; resourceType?: string; startDate?: string; endDate?: string }) {
    const page = query.page || 1;
    const qb = this.repo.createQueryBuilder('a').where('a.tenant_id = :tenantId', { tenantId });

    if (query.userId) qb.andWhere('a.user_id = :userId', { userId: query.userId });
    if (query.actionType) qb.andWhere('a.action_type = :actionType', { actionType: query.actionType });
    if (query.resourceType) qb.andWhere('a.resource_type = :resourceType', { resourceType: query.resourceType });
    if (query.startDate) qb.andWhere('a.created_at >= :startDate', { startDate: query.startDate });
    if (query.endDate) qb.andWhere('a.created_at <= :endDate', { endDate: query.endDate });

    const [data, total] = await qb.skip((page - 1) * 100).take(100).orderBy('a.created_at', 'DESC').getManyAndCount();
    return { data, meta: { page, pageSize: 100, total, totalPages: Math.ceil(total / 100) } };
  }
}
