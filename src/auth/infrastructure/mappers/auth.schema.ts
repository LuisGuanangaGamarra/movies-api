import { Schema } from 'morphism';
import { AuthRequestDto } from '../../presentation/dtos/auth-request.dto';
import { LoginInputApplicationDTO } from '../../application/dtos/login-input-application.dto';
import { AuthResponseDto } from '../../presentation/dtos/auth-response.dto';

import { LoginOutputApplicationDTO } from '../../application/dtos/login-ouput-application.dto';

export const AuthRequestToApplicationSchema: Schema<
  LoginInputApplicationDTO,
  AuthRequestDto
> = {
  email: 'email',
  password: 'password',
};

export const LoginOutputApplicationToRequestSchema: Schema<
  AuthResponseDto,
  LoginOutputApplicationDTO
> = {
  token: 'token',
};
