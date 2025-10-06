import {
  Controller,
  Get,
  Query,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { SyncStarWarsMoviesUseCase } from '../aplication/use-cases/sync-sw-movies.usecase';
import { ListUserRequestDto } from './dtos/list-user-request.dto';
import {
  type IMoviesMapper,
  MOVIES_MAPPER,
} from '../domain/interfaces/movies.mapper';
import { ListMoviesUseCase } from '../aplication/use-cases/list-movies.usecase';
import { ListMoviesResponseDto } from './dtos/list-movies-response.dto';
import { GetMovieUseCase } from '../aplication/use-cases/get-movie.usecase';
import { MovieDTO } from './dtos/movie.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../../shared/presentation/permission.decorator';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';
import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';

@ApiTags('movies')
@Controller('movies')
@UseInterceptors(ClassSerializerInterceptor)
export class MoviesController {
  constructor(
    private readonly syncSawpiUC: SyncStarWarsMoviesUseCase,
    @Inject(MOVIES_MAPPER)
    private readonly moviesMapper: IMoviesMapper,
    private readonly listMoviesUC: ListMoviesUseCase,
    private readonly getMovieUC: GetMovieUseCase,
  ) {}

  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: 'syncronizacion exitosa',
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permission('MOVIE_SYNC')
  @Get('sync')
  @HttpCode(HttpStatus.OK)
  async syncMovies() {
    return this.syncSawpiUC.execute();
  }

  @ApiOkResponse({
    description: 'Listado de peliculas',
    type: ListMoviesResponseDto,
  })
  @SerializeOptions({ type: ListMoviesResponseDto })
  @Get()
  async listMovies(@Query() params: ListUserRequestDto) {
    const input = this.moviesMapper.toInput(params);
    const response = await this.listMoviesUC.execute(input);
    return this.moviesMapper.toOutput(response);
  }

  @ApiOkResponse({
    description: 'Pelicula encontrada',
    type: MovieDTO,
  })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @ApiBearerAuth('access-token')
  @Permission('MOVIE_READ')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @SerializeOptions({ type: MovieDTO })
  @Get(':id')
  async getMovieById(@Param('id') id: number) {
    const movie = await this.getMovieUC.execute(id);
    return this.moviesMapper.toMovieResponse(movie);
  }
}
