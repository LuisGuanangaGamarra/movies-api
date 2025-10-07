import { LoginInputApplicationDTO } from '../../application/dtos/login-input-application.dto';
import { AuthRequestDto } from '../../presentation/dtos/auth-request.dto';
import { AuthResponseDto } from '../../presentation/dtos/auth-response.dto';

import { LoginOutputApplicationDTO } from '../../application/dtos/login-ouput-application.dto';

export interface IAuthMapper {
  toApplication(payload: AuthRequestDto): LoginInputApplicationDTO;
  toResponse(payload: LoginOutputApplicationDTO): AuthResponseDto;
}

export const AUTH_MAPPER = Symbol('AUTH_MAPPER');
