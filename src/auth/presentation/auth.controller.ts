import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { AuthRequestDto } from './dtos/auth-request.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { ApiTags, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';
import { AUTH_MAPPER, type IAuthMapper } from '../domain/mappers/auth.mapper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    @Inject(AUTH_MAPPER)
    private readonly authMapper: IAuthMapper,
  ) {}

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
    const dtoInput = this.authMapper.toApplication(loginDto);
    const result = await this.loginUC.execute(dtoInput);
    return this.authMapper.toResponse(result);
  }
}
