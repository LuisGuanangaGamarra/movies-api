import { ListUserRequestDto } from '../../presentation/dtos/list-user-request.dto';
import {
  PaginatedResult,
  type PaginationParams,
  PartialExcept,
} from '../../types';
import { Movie } from '../movie.entity';
import { ListUsersResponseDto } from '../../presentation/dtos/list-users-response.dto';
import { MovieOrmEntity } from '../../infra/orm/movie.orm-entity';
import { SawpiResponseDTO } from '../../infra/swapi/types';

export interface IMoviesMapper {
  toInput(params: ListUserRequestDto): PaginationParams;
  toOutput(data: PaginatedResult<Movie>): ListUsersResponseDto;
  toListDomain(data: MovieOrmEntity[]): Movie[];
  toDomain(data: MovieOrmEntity): Movie;
  toOrm(
    data: Omit<Movie, 'id'> | Movie | PartialExcept<Movie, 'id'>,
  ): MovieOrmEntity;
  toListOrm(data: Omit<Movie, 'id'>[] | Movie[]): MovieOrmEntity[];
  fromExternalToDomain(data: SawpiResponseDTO): Movie[];
}

export const MOVIES_MAPPER = Symbol('MOVIES_MAPPER');
