import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieOrmEntity } from './infra/orm/movie.orm-entity';
import { MOVIE_REPOSITORY } from './domain/repositories/movie.repository';
import { MovieTypeOrmRepository } from './infra/repositories/movie.typeorm.repository';
import { SWAPI_CLIENT } from './infra/swapi/swapi.interface';
import { SwapiClient } from './infra/swapi/swapi.client';
import { SyncStarWarsMoviesUseCase } from './aplication/use-cases/sync-sw-movies.usecase';
import { ListMoviesUseCase } from './aplication/use-cases/list-movies.usecase';
import { MoviesController } from './presentation/movies.controller';
import { MOVIES_MAPPER } from './domain/interfaces/movies.mapper';
import { MovieMapper } from './infra/mappers/movies-mappers/movie.mapper';
import { GetMovieUseCase } from './aplication/use-cases/get-movie.usecase';
import { CreateMovieUseCase } from './aplication/use-cases/create-movie.usecase,ts';
import { UpdateMovieUsecase } from './aplication/use-cases/update-movie.usecase';

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
    {
      provide: MOVIES_MAPPER,
      useClass: MovieMapper,
    },
    SyncStarWarsMoviesUseCase,
    ListMoviesUseCase,
    GetMovieUseCase,
    CreateMovieUseCase,
    UpdateMovieUsecase,
  ],
  controllers: [MoviesController],
})
export class MoviesModule {}
