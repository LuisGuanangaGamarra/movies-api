import { AuthDto, AuthResponseDto } from '../dtos/auth.dto';
import {
  LoginInputDTO,
  LoginOutputDTO,
  RegisterInputDTO,
  Role,
} from '../../application/use-cases/dtos/dtos';

export class AuthHttpMapper {
  static toApplication<
    T extends AuthDto,
    V extends LoginInputDTO | RegisterInputDTO,
  >(input: T, role?: Role): V {
    const map: V = {
      email: input.email,
      password: input.password,
    } as V;

    if (role) {
      (map as RegisterInputDTO).role = role;
    }

    return map;
  }

  static toHttp(input: LoginOutputDTO): AuthResponseDto {
    return {
      token: input.token,
    };
  }
}
