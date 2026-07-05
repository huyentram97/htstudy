import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../users/entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission) private readonly permRepo: Repository<Permission>,
  ) {}

  async findAllRoles(tenantId: string) {
    return this.roleRepo.find({ where: { tenantId } });
  }

  async createRole(data: { name: string; description?: string; tenantId: string }) {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async deleteRole(id: string) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    if (role.isSystem) throw new Error('Cannot delete system role');
    await this.roleRepo.remove(role);
  }

  async findAllPermissions() {
    return this.permRepo.find();
  }

  async createPermission(data: { resource: string; action: string; description?: string }) {
    const perm = this.permRepo.create(data);
    return this.permRepo.save(perm);
  }
}
