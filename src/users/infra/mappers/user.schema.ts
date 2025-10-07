import { Schema } from 'morphism';

import { RegisterUserInputDTO } from '../../aplication/dtos/register-user-input.dto';
import { UserRegisterDto } from '../../presentation/dtos/user-register.dto';
import { Role } from '../../aplication/dtos/register-user-input.dto';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { RoleEntity } from '../../domain/role.entity';
import { PermissionEntity } from '../../domain/permission.entity';

export type UserRequestWithRole = UserRegisterDto & { role: Role };

export const userRequestDTOTOUserInput: Schema<
  RegisterUserInputDTO,
  UserRequestWithRole
> = {
  email: 'email',
  password: 'password',
  role: 'role',
};

export const userOrmEntityToDomain: Schema<UserEntity, UserOrmEntity> = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  role: (src: UserOrmEntity): RoleEntity => {
    const permissions = src.role.permissions.map(
      (permission) => new PermissionEntity(permission.id, permission.name),
    );
    return new RoleEntity(src.role.id, src.role.name, permissions);
  },
};
