import { UserRegisterDto } from '../dtos/user-register.dto';

import {
  RegisterUserInputDTO,
  Role,
} from '../../aplication/dtos/register-user-input.dto';

export class UserHttpMapper {
  static toApplication(
    user: UserRegisterDto,
    role: Role,
  ): RegisterUserInputDTO {
    return {
      email: user.email,
      password: user.password,
      role: role,
    };
  }
}
