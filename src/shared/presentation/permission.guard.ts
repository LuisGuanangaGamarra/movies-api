import { CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { PERMISSION_DECORATOR_KEY } from './permission.decorator';
import { RoleOrmEntity } from '../../users/infra/orm/role.orm-entity';
import { type Request } from 'express';

export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_DECORATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return Promise.resolve(true);
    }

    const request: Request & { user: { role: string } } = context
      .switchToHttp()
      .getRequest();
    const user = request.user;
    if (!user) return Promise.resolve(false);

    const roleRepo = this.dataSource.getRepository(RoleOrmEntity);
    const role = await roleRepo.findOne({
      where: { name: user.role },
      relations: ['permissions'],
    });

    if (!role) return Promise.resolve(false);

    const granted = role.permissions.map((p) => p.name);
    return requiredPermissions.every((p) => granted.includes(p));
  }
}
