import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES'),
          algorithm: 'HS256',
          issuer: config.get<string>('JWT_ISSUER'),
          audience: config.get<string>('JWT_AUDIENCE'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, LoginUseCase],
})
export class AuthModule {}
