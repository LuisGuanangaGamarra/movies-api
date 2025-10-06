import { ListUserRequestDto } from '../../presentation/dtos/list-user-request.dto';
import {
  PaginatedResult,
  type PaginationParams,
  PartialExcept,
} from '../../types';
import { Movie } from '../movie.entity';
import { ListMoviesResponseDto } from '../../presentation/dtos/list-movies-response.dto';
import { MovieOrmEntity } from '../../infra/orm/movie.orm-entity';
import { SawpiResponseDTO } from '../../infra/swapi/types';
import { MovieDTO } from '../../presentation/dtos/movie.dto';

export interface IMoviesMapper {
  toInput(params: ListUserRequestDto): PaginationParams;
  toOutput(data: PaginatedResult<Movie>): ListMoviesResponseDto;
  toListDomain(data: MovieOrmEntity[]): Movie[];
  toDomain(data: MovieOrmEntity): Movie;
  toOrm(
    data: Omit<Movie, 'id'> | Movie | PartialExcept<Movie, 'id'>,
  ): MovieOrmEntity;
  toListOrm(data: Omit<Movie, 'id'>[] | Movie[]): MovieOrmEntity[];
  fromExternalToDomain(data: SawpiResponseDTO): Movie[];
  toMovieResponse(data: Movie): MovieDTO;
}

export const MOVIES_MAPPER = Symbol('MOVIES_MAPPER');
