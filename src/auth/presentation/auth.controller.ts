import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RegisterUserUseCase } from '../application/use-cases/register-user.usecase';
import { AuthRequestDto } from './dtos/auth-request.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtAuthGuard } from '../infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';
import { Permission } from '../../shared/presentation/permission.decorator';
import { AuthHttpMapper } from './mappers/auth-http.mapper';
import {
  LoginInputDTO,
  RegisterInputDTO,
} from '../application/use-cases/dtos/dtos';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly registerUC: RegisterUserUseCase,
  ) {}

  @ApiCreatedResponse({ description: 'Usuario registrado exitosamente' })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @Post('register')
  register(@Body() registerDto: AuthRequestDto) {
    const dtoInput = AuthHttpMapper.toApplication<
      AuthRequestDto,
      RegisterInputDTO
    >(registerDto, 'REGULAR');

    return this.registerUC.execute(dtoInput);
  }

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
    const dtoInput = AuthHttpMapper.toApplication<
      AuthRequestDto,
      LoginInputDTO
    >(loginDto);
    const result = await this.loginUC.execute(dtoInput);
    return AuthHttpMapper.toHttp(result);
  }

  @ApiCreatedResponse({ description: 'Usuario registrado exitosamente' })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @ApiBearerAuth('access-token')
  @Permission('USER_CREATE_ADMIN')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('register-admin')
  registerAdmin(@Body() registerDto: AuthRequestDto) {
    const dtoInput = AuthHttpMapper.toApplication<
      AuthRequestDto,
      RegisterInputDTO
    >(registerDto, 'ADMIN');

    return this.registerUC.execute(dtoInput);
  }
}
