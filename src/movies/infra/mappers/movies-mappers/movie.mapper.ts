import { Injectable } from '@nestjs/common';
import { IMoviesMapper } from '../../../domain/interfaces/movies.mapper';
import { ListUserRequestDto } from '../../../presentation/dtos/list-user-request.dto';
import { PaginatedResult, PaginationParams } from '../../../types';
import {
  movieEntityToDomain,
  movieInputToDomain,
  movieOrmEntityToDomain,
  movieOutputToResponse,
  movieRequestCreateToInput,
  movieRequestDTOToInput,
  movieToMovieResponse,
  swapiToMovieSchema,
} from './movie.schema';
import { morphism } from 'morphism';
import { Movie } from '../../../domain/movie.entity';
import { ListMoviesResponseDto } from '../../../presentation/dtos/list-movies-response.dto';
import { MovieOrmEntity } from '../../orm/movie.orm-entity';
import { SawpiResponseDTO } from '../../swapi/types';
import { MovieDTO } from '../../../presentation/dtos/movie.dto';
import { MovieInputDto } from '../../../aplication/use-cases/dtos/movie-input.dto';
import { MovieRequestCreateDto } from '../../../presentation/dtos/movie-request-create.dto';

@Injectable()
export class MovieMapper implements IMoviesMapper {
  private readonly requestToInputSchema = movieRequestDTOToInput;
  private readonly outputToResponseSchema = movieOutputToResponse;
  private readonly toDomainSchema = movieEntityToDomain;
  private readonly toOrmSchema = movieOrmEntityToDomain;
  private readonly fromExternalToDomainSchema = swapiToMovieSchema;
  private readonly toMovieResponseSchema = movieToMovieResponse;
  private readonly fromInputToDomainSchema = movieInputToDomain;
  private readonly fromRequestCreatetoInputSchema = movieRequestCreateToInput;

  toInput(params: ListUserRequestDto): PaginationParams {
    return morphism(this.requestToInputSchema, params);
  }

  toOutput(data: PaginatedResult<Movie>): ListMoviesResponseDto {
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

  toMovieResponse(data: Movie): MovieDTO {
    return morphism(this.toMovieResponseSchema, data);
  }

  fromRequestCreateToMovieInput(data: MovieRequestCreateDto): MovieInputDto {
    return morphism(this.fromRequestCreatetoInputSchema, data, MovieInputDto);
  }

  fromInputToDomain(data: MovieInputDto): Movie {
    return morphism(this.fromInputToDomainSchema, data, Movie);
  }
}
