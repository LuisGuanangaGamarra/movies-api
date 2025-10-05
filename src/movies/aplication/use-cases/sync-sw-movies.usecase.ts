import { Inject, Injectable } from '@nestjs/common';
import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from '../../domain/repositories/movie.repository';
import { SWAPI_CLIENT, type ISwapiClient } from '../../infra/swapi/swapi';
import { ExternalMovieMapper } from '../../infra/swapi/swapi.mapper';

@Injectable()
export class SyncStarWarsMoviesUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
    @Inject(SWAPI_CLIENT) private readonly swapi: ISwapiClient,
  ) {}

  async execute() {
    const films = await this.swapi.fetchFilms();
    if (!films || !films.result?.length) {
      return;
    }

    const movies = ExternalMovieMapper.toDomain(films);

    if (movies.length <= 0) {
      return;
    }

    await this.movieRepository.upsertByExternalId(movies);
  }
}
