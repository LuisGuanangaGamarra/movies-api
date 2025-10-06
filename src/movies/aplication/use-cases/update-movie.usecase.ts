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
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

@Injectable()
export class UpdateMovieUsecase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly repo: IMovieRepository,
    @Inject(MOVIES_MAPPER)
    private readonly mapper: IMoviesMapper,
  ) {}

  async execute(input: MovieInputDto) {
    const domainMovie = this.mapper.fromInputToDomain(input);
    const movie = await this.repo.findByTitleAndDifferentId(
      domainMovie.title,
      domainMovie.id,
    );
    if (movie)
      throw new DomainException(
        'MOVIE_TITLE_ALREADY_EXISTS',
        'Pelicula con ese nombre ya se encuentra registrada',
      );
    await this.repo.update(domainMovie);
  }
}
