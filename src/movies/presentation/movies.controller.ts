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
  Post,
  Body,
  Patch,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../../shared/presentation/permission.decorator';
import { JwtAuthGuard } from '../../auth/infrastructure/jwt-auth.guard';
import { PermissionGuard } from '../../shared/presentation/permission.guard';
import { ErrorDomainResponseDto } from '../../shared/presentation/dtos/error-domain-response.dto';
import { CreateMovieUseCase } from '../aplication/use-cases/create-movie.usecase,ts';
import { MovieRequestCreateDto } from './dtos/movie-request-create.dto';
import { UpdateMovieUsecase } from '../aplication/use-cases/update-movie.usecase';
import { MovieRequestUpdateDto } from './dtos/movie-request-update.dto';

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
    private readonly createMovieUC: CreateMovieUseCase,
    private readonly updateMovieUC: UpdateMovieUsecase,
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
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

  @ApiCreatedResponse({ description: 'Pelicula creada exitosamente' })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @ApiBearerAuth('access-token')
  @Permission('MOVIE_CREATE')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post()
  async createMovie(@Body() movie: MovieRequestCreateDto) {
    const input = this.moviesMapper.fromRequestCreateToMovieInput(movie);
    await this.createMovieUC.execute(input);
  }

  @ApiOkResponse({ description: 'Pelicula actualizada exitosamente' })
  @ApiBadRequestResponse({
    description: 'Errores de negocio o validación',
    type: ErrorDomainResponseDto,
  })
  @ApiBearerAuth('access-token')
  @Permission('MOVIE_UPDATE')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Patch()
  async updateMovie(@Body() movie: MovieRequestUpdateDto) {
    const input = this.moviesMapper.fromRequestUpdateToMovieInput(movie);
    await this.updateMovieUC.execute(input);
  }
}
