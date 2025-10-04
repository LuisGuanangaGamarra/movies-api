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
import { AuthDtoRequest } from '../dtos/auth.dto';
import { JwtAuthGuard } from '../infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';
import { Permission } from '../../shared/presentation/permission.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly registerUC: RegisterUserUseCase,
  ) {}

  @Post('register')
  register(@Body() registerDto: AuthDtoRequest) {
    return this.registerUC.execute({
      ...registerDto,
      role: 'REGULAR',
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: AuthDtoRequest) {
    return this.loginUC.execute(loginDto);
  }

  @Permission('USER_CREATE_ADMIN')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post('register-admin')
  registerAdmin(@Body() registerDto: AuthDtoRequest) {
    return this.registerUC.execute({
      ...registerDto,
      role: 'ADMIN',
    });
  }
}
