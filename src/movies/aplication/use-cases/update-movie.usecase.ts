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
import { Movie } from '../../domain/movie.entity';

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
    let otherMovie: Movie | null = null;

    const movie = await this.repo.findById(domainMovie.id);
    if (!movie)
      throw new DomainException('MOVIE_NOT_FOUND', 'Pelicula no encontrada');

    if (input.title !== null && input.title !== undefined && input.title !== '')
      otherMovie = await this.repo.findByTitleAndDifferentId(
        domainMovie.title,
        domainMovie.id,
      );

    if (otherMovie)
      throw new DomainException(
        'MOVIE_TITLE_ALREADY_EXISTS',
        'Pelicula con ese nombre ya se encuentra registrada',
      );
    await this.repo.update(domainMovie);
  }
}
