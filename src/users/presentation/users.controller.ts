import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UserHttpMapper } from './mappers/user-http.mapper';
import { RegisterUserUseCase } from '../aplication/use-cases/register-user.usecase';
import { Permission } from '../../shared/presentation/permission.decorator';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly registerUC: RegisterUserUseCase) {}

  @ApiCreatedResponse({ description: 'Usuario registrado exitosamente' })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @Post('register')
  register(@Body() registerDto: UserRegisterDto) {
    const dtoInput = UserHttpMapper.toApplication(registerDto, 'REGULAR');

    return this.registerUC.execute(dtoInput);
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
  registerAdmin(@Body() registerDto: UserRegisterDto) {
    const dtoInput = UserHttpMapper.toApplication(registerDto, 'ADMIN');

    return this.registerUC.execute(dtoInput);
  }
}
