import { Injectable } from '@nestjs/common';
import { IMoviesMapper } from '../../../domain/interfaces/movies.mapper';
import { ListUserRequestDto } from '../../../presentation/dtos/list-user-request.dto';
import { PaginatedResult, PaginationParams } from '../../../types';
import {
  movieEntityToDomain,
  movieOrmEntityToDomain,
  movieOutputToResponse,
  movieRequestDTOToInput,
  swapiToMovieSchema,
} from './movie.schema';
import { morphism } from 'morphism';
import { Movie } from '../../../domain/movie.entity';
import { ListUsersResponseDto } from '../../../presentation/dtos/list-users-response.dto';
import { MovieOrmEntity } from '../../orm/movie.orm-entity';
import { SawpiResponseDTO } from '../../swapi/types';

@Injectable()
export class MovieMapper implements IMoviesMapper {
  private readonly requestToInputSchema = movieRequestDTOToInput;
  private readonly outputToResponseSchema = movieOutputToResponse;
  private readonly toDomainSchema = movieEntityToDomain;
  private readonly toOrmSchema = movieOrmEntityToDomain;
  private readonly fromExternalToDomainSchema = swapiToMovieSchema;

  toInput(params: ListUserRequestDto): PaginationParams {
    return morphism(this.requestToInputSchema, params);
  }

  toOutput(data: PaginatedResult<Movie>): ListUsersResponseDto {
    return morphism(this.outputToResponseSchema, data);
  }

  toListDomain(data: MovieOrmEntity[]): Movie[] {
    return morphism(this.toDomainSchema, data, Movie);
  }

  toDomain(data: MovieOrmEntity): Movie {
    return morphism(this.toDomainSchema, data, Movie);
  }

  toOrm(data: Omit<Movie, 'id'> | Movie): MovieOrmEntity {
    return morphism(this.toOrmSchema, data, MovieOrmEntity);
  }

  toListOrm(data: Omit<Movie, 'id'>[] | Movie[]): MovieOrmEntity[] {
    return morphism(this.toOrmSchema, data, MovieOrmEntity);
  }

  fromExternalToDomain(data: SawpiResponseDTO): Movie[] {
    return morphism(this.fromExternalToDomainSchema, data.result, Movie);
  }
}
