import { Schema } from 'morphism';
import { ListUserRequestDto } from '../../../presentation/dtos/list-user-request.dto';
import { PaginatedResult, type PaginationParams } from '../../../types';
import { ListUsersResponseDto } from '../../../presentation/dtos/list-users-response.dto';
import { Movie } from '../../../domain/movie.entity';
import { MovieDto } from '../../../presentation/dtos/movie.dto';
import { MovieOrmEntity } from '../../orm/movie.orm-entity';
import { Result } from '../../swapi/types';

const mapMovies = (movies: Movie[]): MovieDto[] =>
  movies.map<MovieDto>((movie) => ({
    id: movie.id,
    title: movie.title,
    director: movie.director,
    synopsis: movie.synopsis,
    releaseDate: movie.releaseDate,
  }));

export const movieRequestDTOToInput: Schema<
  PaginationParams,
  ListUserRequestDto
> = {
  page: 'page',
  limit: 'limit',
};

export const movieOutputToResponse: Schema<
  ListUsersResponseDto,
  PaginatedResult<Movie>
> = {
  movies: (iteratee) => {
    return mapMovies(iteratee.data);
  },
  total: 'total',
  page: 'page',
  limit: 'limit',
  pages: 'pages',
};

export const movieEntityToDomain: Schema<Movie, MovieOrmEntity> = {};

export const movieOrmEntityToDomain: Schema<
  MovieOrmEntity,
  Partial<Movie>
> = {};

export const swapiToMovieSchema: Schema<Omit<Movie, 'id'>, Result> = {
  title: (src) => src.properties.title,
  director: (src) => src.properties.director,
  releaseDate: (src) => new Date(src.properties.release_date),
  synopsis: (src) => src.properties.opening_crawl?.replace(/\r\n/g, '') ?? '',
  externalId: (src) => src._id ?? null,
};
