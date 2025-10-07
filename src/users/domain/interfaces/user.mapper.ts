import { UserRequestWithRole } from '../../infra/mappers/user.schema';
import { RegisterUserInputDTO } from '../../aplication/dtos/register-user-input.dto';
import { UserOrmEntity } from '../../infra/orm/user.orm-entity';
import { UserEntity } from '../user.entity';

export interface IUserMapper {
  fromRequestToApplication(
    userRequestDTO: UserRequestWithRole,
  ): RegisterUserInputDTO;

  fromOrmEntityToDomain(userOrmEntity: UserOrmEntity): UserEntity;
}

export const USER_MAPPER = Symbol('USER_MAPPER');
