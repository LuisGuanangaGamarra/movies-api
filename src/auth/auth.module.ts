import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.usecase';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [JwtStrategy, LoginUseCase],
})
export class AuthModule {}
