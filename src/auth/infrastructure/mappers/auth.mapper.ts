import { IAuthMapper } from '../../domain/mappers/auth.mapper';
import { Injectable } from '@nestjs/common';
import {
  AuthRequestToApplicationSchema,
  LoginOutputApplicationToRequestSchema,
} from './auth.schema';
import { AuthRequestDto } from '../../presentation/dtos/auth-request.dto';
import { LoginInputApplicationDTO } from '../../application/dtos/login-input-application.dto';
import { morphism } from 'morphism';
import { AuthResponseDto } from '../../presentation/dtos/auth-response.dto';

import { LoginOutputApplicationDTO } from '../../application/dtos/login-ouput-application.dto';

@Injectable()
export class AuthMapper implements IAuthMapper {
  private readonly loginRequestToApplicationSchema =
    AuthRequestToApplicationSchema;
  private readonly loginOutputToResponseSchema =
    LoginOutputApplicationToRequestSchema;

  toApplication(payload: AuthRequestDto): LoginInputApplicationDTO {
    return morphism(this.loginRequestToApplicationSchema, payload);
  }

  toResponse(payload: LoginOutputApplicationDTO): AuthResponseDto {
    return morphism(this.loginOutputToResponseSchema, payload, AuthResponseDto);
  }
}
