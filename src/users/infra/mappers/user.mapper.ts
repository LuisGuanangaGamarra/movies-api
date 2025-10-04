import { UserOrmEntity } from '../orm/user.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { RoleEntity } from '../../domain/role.entity';
import { PermissionEntity } from '../../domain/permission.entity';

export class UserMapper {
  static mapToDomain(user: UserOrmEntity): UserEntity {
    const permissions = user.role.permissions.map(
      (permission) => new PermissionEntity(permission.id, permission.name),
    );
    const rol = new RoleEntity(user.role.id, user.role.name, permissions);
    return new UserEntity(user.id, user.email, user.passwordHash, rol);
  }
}
