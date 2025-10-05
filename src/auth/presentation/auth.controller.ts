import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { AuthRequestDto } from './dtos/auth-request.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { AuthHttpMapper } from './mappers/auth-http.mapper';
import { ApiTags, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUC: LoginUseCase) {}

  @ApiOkResponse({
    description: 'Usuario logueado exitosamente',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthRequestDto) {
    const dtoInput = AuthHttpMapper.toApplication(loginDto);
    const result = await this.loginUC.execute(dtoInput);
    return AuthHttpMapper.toHttp(result);
  }
}
