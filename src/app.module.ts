import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './shared/infra/data-source';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './auth/infrastructure/jwt.strategy';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DataSource.options),
    UsersModule,
    AuthModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
