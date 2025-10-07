import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards, Inject } from '@nestjs/common';
import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { RegisterUserUseCase } from '../aplication/use-cases/register-user.usecase';
import { Permission } from '../../shared/presentation/permission.decorator';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';
import {
  type IUserMapper,
  USER_MAPPER,
} from '../domain/interfaces/user.mapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly registerUC: RegisterUserUseCase,
    @Inject(USER_MAPPER)
    private readonly userMapper: IUserMapper,
  ) {}

  @ApiCreatedResponse({ description: 'Usuario registrado exitosamente' })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @Post('register')
  register(@Body() registerDto: UserRegisterDto) {
    const dtoInput = this.userMapper.fromRequestToApplication({
      ...registerDto,
      role: 'REGULAR',
    });
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
    const dtoInput = this.userMapper.fromRequestToApplication({
      ...registerDto,
      role: 'ADMIN',
    });
    return this.registerUC.execute(dtoInput);
  }
}
