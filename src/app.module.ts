import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DataSource from './shared/infra/data-source';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './auth/infrastructure/jwt.strategy';
import { MoviesModule } from './movies/movies.module';
import { resolve } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '/etc/secrets/.env',
        resolve(__dirname, `../.env`) ?? undefined,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isSSL = config.get<string>('DB_SSL', 'false');
        const sslConfig =
          isSSL === 'true' ? { rejectUnauthorized: false } : false;
        return {
          ...(DataSource.options as PostgresConnectionOptions),
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT')!,
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: config.get<string>('DB_NAME'),
          ssl: sslConfig,
        };
      },
    }),
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
    UsersModule,
    AuthModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
