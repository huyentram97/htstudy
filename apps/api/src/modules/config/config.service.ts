import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from './entities/system-config.entity';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig) private readonly repo: Repository<SystemConfig>,
  ) {}

  async getAll(tenantId: string) {
    const configs = await this.repo.find({ where: { tenantId } });
    const result: Record<string, any> = {};
    configs.forEach((c) => { result[c.configKey] = c.configValue; });
    return result;
  }

  async get(tenantId: string, key: string) {
    const config = await this.repo.findOne({ where: { tenantId, configKey: key } });
    return config?.configValue;
  }

  async set(tenantId: string, key: string, value: any, userId: string) {
    let config = await this.repo.findOne({ where: { tenantId, configKey: key } });
    if (!config) {
      config = this.repo.create({ tenantId, configKey: key, configValue: value, updatedBy: userId });
    } else {
      config.configValue = value;
      config.updatedBy = userId;
    }
    return this.repo.save(config);
  }

  async setBulk(tenantId: string, configs: Record<string, any>, userId: string) {
    for (const [key, value] of Object.entries(configs)) {
      await this.set(tenantId, key, value, userId);
    }
    return this.getAll(tenantId);
  }
}
