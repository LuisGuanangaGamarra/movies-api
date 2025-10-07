import { UserOrmEntity } from '../../../../src/users/infra/orm/user.orm-entity';

export const mockUserOrmEntity = {
  id: 1,
  email: 'l',
  passwordHash: 'hash',
  role: {
    id: 1,
    name: 'admin',
  },
} as UserOrmEntity;
