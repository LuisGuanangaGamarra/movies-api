import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrmEntity } from './infra/orm/role.orm-entity';
import { PermissionOrmEntity } from './infra/orm/permission.orm-entity';
import { UserOrmEntity } from './infra/orm/user.orm-entity';
import { ROLE_REPOSITORY } from './application/role.repository';
import { RoleTypeormRepository } from './infra/repositories/role.typeorm.repository';
import { USER_REPOSITORY } from './application/user.repository';
import { UserTypeOrmRepository } from './infra/repositories/user.typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleOrmEntity,
      PermissionOrmEntity,
      UserOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleTypeormRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [ROLE_REPOSITORY, USER_REPOSITORY],
})
export class UsersModule {}
