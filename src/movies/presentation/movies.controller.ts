import { Controller, Get, Query, Inject } from '@nestjs/common';
import { SyncStarWarsMoviesUseCase } from '../aplication/use-cases/sync-sw-movies.usecase';
import { ListUserRequestDto } from './dtos/list-user-request.dto';
import {
  type IMoviesMapper,
  MOVIES_MAPPER,
} from '../domain/interfaces/movies.mapper';
import { ListMoviesUseCase } from '../aplication/use-cases/list-movies.usecase';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly syncSawpiUC: SyncStarWarsMoviesUseCase,
    @Inject(MOVIES_MAPPER)
    private readonly moviesMapper: IMoviesMapper,
    private readonly listMoviesUC: ListMoviesUseCase,
  ) {}

  @Get('sync')
  async syncMovies() {
    return this.syncSawpiUC.execute();
  }

  @Get()
  async listMovies(@Query() params: ListUserRequestDto) {
    const input = this.moviesMapper.toInput(params);
    const response = await this.listMoviesUC.execute(input);
    return this.moviesMapper.toOutput(response);
  }
}
