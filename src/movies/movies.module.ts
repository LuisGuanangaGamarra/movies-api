import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieOrmEntity } from './infra/orm/movie.orm-entity';
import { MOVIE_REPOSITORY } from './domain/repositories/movie.repository';
import { MovieTypeOrmRepository } from './infra/repositories/movie.typeorm.repository';
import { SWAPI_CLIENT } from './infra/swapi/swapi';
import { SwapiClient } from './infra/swapi/swapi.client';
import { SyncStarWarsMoviesUseCase } from './aplication/use-cases/sync-sw-movies.usecase';
import { MoviesController } from './presentation/movies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieOrmEntity])],
  providers: [
    {
      provide: MOVIE_REPOSITORY,
      useClass: MovieTypeOrmRepository,
    },
    {
      provide: SWAPI_CLIENT,
      useClass: SwapiClient,
    },
    SyncStarWarsMoviesUseCase,
  ],
  controllers: [MoviesController],
})
export class MoviesModule {}
