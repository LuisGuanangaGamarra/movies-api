import { UserMapper } from 'src/users/infra/mappers/user.mapper';
import {
  userRequestDTOTOUserInput,
  userOrmEntityToDomain,
  UserRequestWithRole,
} from 'src/users/infra/mappers/user.schema';
import { RegisterUserInputDTO } from 'src/users/aplication/dtos/register-user-input.dto';
import { UserOrmEntity } from 'src/users/infra/orm/user.orm-entity';
import { UserEntity } from 'src/users/domain/user.entity';
import { RoleEntity } from '../../../../../src/users/domain/role.entity';
import { RoleOrmEntity } from '../../../../../src/users/infra/orm/role.orm-entity';

const mockMorphismFunc = jest.fn<unknown, unknown[]>();
jest.mock('morphism', () => ({
  morphism: (...arg: unknown[]) => mockMorphismFunc(...arg),
}));

describe('UserMapper', () => {
  let userMapper: UserMapper;

  beforeEach(() => {
    userMapper = new UserMapper();
  });

  describe('fromRequestToApplication', () => {
    it('debería transformar UserRequestWithRole en RegisterUserInputDTO usando morphism', () => {
      const userRequestMock: UserRequestWithRole = {
        email: 'test@example.com',
        password: 'password',
        role: 'ADMIN',
      };
      const expectedResult: RegisterUserInputDTO = {
        email: 'test@example.com',
        password: 'password',
        role: 'ADMIN',
      };
      mockMorphismFunc.mockReturnValueOnce(expectedResult);

      const result = userMapper.fromRequestToApplication(userRequestMock);

      expect(mockMorphismFunc).toHaveBeenCalledWith(
        userRequestDTOTOUserInput,
        userRequestMock,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('fromOrmEntityToDomain', () => {
    it('debería transformar UserOrmEntity en UserEntity usando morphism', () => {
      const userOrmEntityMock: UserOrmEntity = new UserOrmEntity();
      userOrmEntityMock.id = 1;
      userOrmEntityMock.email = 'test@example.com';
      userOrmEntityMock.passwordHash = 'hashedpassword';
      userOrmEntityMock.role = new RoleOrmEntity();
      userOrmEntityMock.role.id = 1;
      userOrmEntityMock.role.name = 'ADMIN';
      userOrmEntityMock.role.permissions = [];

      const expectedResult: UserEntity = new UserEntity(
        userOrmEntityMock.id,
        userOrmEntityMock.email,
        userOrmEntityMock.passwordHash,
        new RoleEntity(1, 'ADMIN', []),
      );
      mockMorphismFunc.mockReturnValueOnce(expectedResult);

      const result = userMapper.fromOrmEntityToDomain(userOrmEntityMock);

      expect(mockMorphismFunc).toHaveBeenCalledWith(
        userOrmEntityToDomain,
        userOrmEntityMock,
        UserEntity,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
