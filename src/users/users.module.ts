import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrmEntity } from './infra/orm/role.orm-entity';
import { PermissionOrmEntity } from './infra/orm/permission.orm-entity';
import { UserOrmEntity } from './infra/orm/user.orm-entity';
import { ROLE_REPOSITORY } from './domain/repositories/role.repository';
import { RoleTypeormRepository } from './infra/repositories/role.typeorm.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { UserTypeOrmRepository } from './infra/repositories/user.typeorm.repository';
import { RegisterUserUseCase } from './aplication/use-cases/register-user.usecase';
import { UsersController } from './presentation/users.controller';
import { USER_MAPPER } from './domain/interfaces/user.mapper';
import { UserMapper } from './infra/mappers/user.mapper';

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
    {
      provide: USER_MAPPER,
      useClass: UserMapper,
    },
    RegisterUserUseCase,
  ],
  controllers: [UsersController],
  exports: [ROLE_REPOSITORY, USER_REPOSITORY],
})
export class UsersModule {}
