import { Injectable } from '@nestjs/common';

import { morphism } from 'morphism';

import {
  userRequestDTOTOUserInput,
  userOrmEntityToDomain,
  UserRequestWithRole,
} from './user.schema';
import { RegisterUserInputDTO } from '../../aplication/dtos/register-user-input.dto';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { UserEntity } from '../../domain/user.entity';
import { IUserMapper } from '../../domain/interfaces/user.mapper';

@Injectable()
export class UserMapper implements IUserMapper {
  private readonly userRequestToApplicationSchema = userRequestDTOTOUserInput;
  private readonly userOrmEntityToDomainSchema = userOrmEntityToDomain;

  public fromRequestToApplication(
    userRequestDTO: UserRequestWithRole,
  ): RegisterUserInputDTO {
    return morphism(this.userRequestToApplicationSchema, userRequestDTO);
  }

  public fromOrmEntityToDomain(userOrmEntity: UserOrmEntity): UserEntity {
    return morphism(
      this.userOrmEntityToDomainSchema,
      userOrmEntity,
      UserEntity,
    );
  }
}
