import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { IRoleRepository } from '../../application/role.repository';
import { RoleEntity } from '../../domain/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '../../domain/permission.entity';
import { RoleOrmEntity } from '../orm/role.orm-entity';

@Injectable()
export class RoleTypeormRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  async findByName(name: string): Promise<RoleEntity | null> {
    const roleOrmEntity = await this.roleRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });

    if (!roleOrmEntity) return null;

    const permissions = roleOrmEntity.permissions.map(
      (p) => new PermissionEntity(p.id, p.name),
    );

    return new RoleEntity(roleOrmEntity.id, roleOrmEntity.name, permissions);
  }
}
