import { Movie } from '../../domain/movie.entity';
import { PaginatedResult, PaginationParams } from '../../types';

export interface IMovieRepository {
  findAll(params?: PaginationParams): Promise<PaginatedResult<Movie>>;
  findById(id: number): Promise<Movie | null>;
  findByTitle(title: string): Promise<Movie | null>;
  save(movie: Movie | Omit<Movie, 'id'>): Promise<void>;
  remove(id: number): Promise<void>;
  upsertByExternalId(movies: Omit<Movie, 'id'>[]): Promise<void>;
}
export const MOVIE_REPOSITORY = Symbol('MOVIE_REPOSITORY');
