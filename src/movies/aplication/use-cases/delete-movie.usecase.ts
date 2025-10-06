import { Injectable, Inject } from '@nestjs/common';
import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from '../../domain/repositories/movie.repository';
import { DomainException } from '../../../shared/domain/exceptions/domain.exception';

@Injectable()
export class DeleteMovieUseCase {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly movies: IMovieRepository,
  ) {}

  async execute(id: number) {
    const movie = await this.movies.findById(id);
    if (!movie)
      throw new DomainException(
        'MOVIE_NOT_FOUND_FOR_DELETE',
        'Pelicula no encontrada para eliminar',
      );

    await this.movies.remove(id);
  }
}
