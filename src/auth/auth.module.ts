import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { AUTH_MAPPER } from './domain/mappers/auth.mapper';
import { AuthMapper } from './infrastructure/mappers/auth.mapper';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    {
      provide: AUTH_MAPPER,
      useClass: AuthMapper,
    },
  ],
})
export class AuthModule {}
