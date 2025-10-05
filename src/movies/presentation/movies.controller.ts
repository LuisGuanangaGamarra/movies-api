import { Controller, Get } from '@nestjs/common';
import { SyncStarWarsMoviesUseCase } from '../aplication/use-cases/sync-sw-movies.usecase';

@Controller('movies')
export class MoviesController {
  constructor(private readonly syncSawpiUC: SyncStarWarsMoviesUseCase) {}

  @Get()
  async syncMovies() {
    return this.syncSawpiUC.execute();
  }
}
