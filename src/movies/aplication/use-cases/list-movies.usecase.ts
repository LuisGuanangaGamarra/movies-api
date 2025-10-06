import { Inject, Injectable } from '@nestjs/common';

import { PaginatedResult, type PaginationParams } from '../../types';
import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/movie.entity';

@Injectable()
export class ListMoviesUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(pagination: PaginationParams): Promise<PaginatedResult<Movie>> {
    return this.movieRepository.findAll(pagination);
  }
}
