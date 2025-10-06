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
import { MovieResponseDto } from '../../presentation/dtos/movie-response.dto';
import { MovieInputDto } from '../../aplication/use-cases/dtos/movie-input.dto';
import { MovieRequestCreateDto } from '../../presentation/dtos/movie-request-create.dto';
import { MovieRequestUpdateDto } from '../../presentation/dtos/movie-request-update.dto';

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
  toMovieResponse(data: Movie): MovieResponseDto;
  fromRequestCreateToMovieInput(data: MovieRequestCreateDto): MovieInputDto;
  fromRequestUpdateToMovieInput(data: MovieRequestUpdateDto): MovieInputDto;
  fromInputToDomain(data: MovieInputDto): Movie;
}

export const MOVIES_MAPPER = Symbol('MOVIES_MAPPER');
