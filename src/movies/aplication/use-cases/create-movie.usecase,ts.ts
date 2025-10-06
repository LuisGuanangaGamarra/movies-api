import { Injectable, Inject } from '@nestjs/common';

import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from '../../domain/repositories/movie.repository';
import { MovieInputDto } from './dtos/movie-input.dto';
import {
  type IMoviesMapper,
  MOVIES_MAPPER,
} from '../../domain/interfaces/movies.mapper';

@Injectable()
export class CreateMovieUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly repo: IMovieRepository,
    @Inject(MOVIES_MAPPER)
    private readonly mapper: IMoviesMapper,
  ) {}

  async execute(input: MovieInputDto) {
    const domainMovie = this.mapper.fromInputToDomain(input);
    await this.repo.save(domainMovie);
  }
}
