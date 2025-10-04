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
import { AuthDto } from './dtos/auth.dto';
import { JwtAuthGuard } from '../infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';
import { Permission } from '../../shared/presentation/permission.decorator';
import { AuthHttpMapper } from './mappers/auth-http.mapper';
import {
  LoginInputDTO,
  RegisterInputDTO,
} from '../application/use-cases/dtos/dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly registerUC: RegisterUserUseCase,
  ) {}

  @Post('register')
  register(@Body() registerDto: AuthDto) {
    const dtoInput = AuthHttpMapper.toApplication<AuthDto, RegisterInputDTO>(
      registerDto,
      'REGULAR',
    );

    return this.registerUC.execute(dtoInput);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthDto) {
    const dtoInput = AuthHttpMapper.toApplication<AuthDto, LoginInputDTO>(
      loginDto,
    );
    const result = await this.loginUC.execute(dtoInput);
    return AuthHttpMapper.toHttp(result);
  }

  @Permission('USER_CREATE_ADMIN')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('register-admin')
  registerAdmin(@Body() registerDto: AuthDto) {
    const dtoInput = AuthHttpMapper.toApplication<AuthDto, RegisterInputDTO>(
      registerDto,
      'ADMIN',
    );

    return this.registerUC.execute(dtoInput);
  }
}
