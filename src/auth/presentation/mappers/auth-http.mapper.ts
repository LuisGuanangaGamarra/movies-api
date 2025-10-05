import { AuthRequestDto } from '../dtos/auth-request.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

import { LoginInputDTO, LoginOutputDTO } from '../../application/dtos/dtos';

export class AuthHttpMapper {
  static toApplication(input: AuthRequestDto): LoginInputDTO {
    const map: LoginInputDTO = {
      email: input.email,
      password: input.password,
    };
    return map;
  }

  static toHttp(input: LoginOutputDTO): AuthResponseDto {
    return {
      token: input.token,
    };
  }
}
