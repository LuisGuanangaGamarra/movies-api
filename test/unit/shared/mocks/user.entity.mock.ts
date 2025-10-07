import { mockUserOrmEntity } from './user-orm.entity.mock';
import { UserEntity } from '../../../../src/users/domain/user.entity';
import { RoleEntity } from '../../../../src/users/domain/role.entity';

export const mockDomainEntity = new UserEntity(
  mockUserOrmEntity.id,
  mockUserOrmEntity.email,
  mockUserOrmEntity.passwordHash,
  new RoleEntity(mockUserOrmEntity.role.id, mockUserOrmEntity.role.name, []),
);
