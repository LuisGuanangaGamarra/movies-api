import { Test } from '@nestjs/testing';
import { SyncStarWarsMoviesUseCase } from 'src/movies/aplication/use-cases/sync-sw-movies.usecase';
import {
  IMovieRepository,
  MOVIE_REPOSITORY,
} from 'src/movies/domain/repositories/movie.repository';
import {
  ISwapiClient,
  SWAPI_CLIENT,
} from 'src/movies/infra/swapi/swapi.interface';
import {
  IMoviesMapper,
  MOVIES_MAPPER,
} from 'src/movies/domain/interfaces/movies.mapper';
import { mockSwapiResponse } from '../../shared/mocks/swapi-response.mock';
import { Movie } from '../../../../src/movies/domain/movie.entity';

describe('SyncStarWarsMoviesUseCase', () => {
  let syncStarWarsMoviesUseCase: SyncStarWarsMoviesUseCase;
  let movieRepository: jest.Mocked<IMovieRepository>;
  let swapiClient: jest.Mocked<ISwapiClient>;
  let moviesMapper: jest.Mocked<IMoviesMapper>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SyncStarWarsMoviesUseCase,
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            upsertByExternalId: jest.fn(),
          },
        },
        {
          provide: SWAPI_CLIENT,
          useValue: {
            fetchFilms: jest.fn(),
          },
        },
        {
          provide: MOVIES_MAPPER,
          useValue: {
            fromExternalToDomain: jest.fn(),
          },
        },
      ],
    }).compile();

    syncStarWarsMoviesUseCase = moduleRef.get<SyncStarWarsMoviesUseCase>(
      SyncStarWarsMoviesUseCase,
    );
    movieRepository = moduleRef.get(MOVIE_REPOSITORY);
    swapiClient = moduleRef.get(SWAPI_CLIENT);
    moviesMapper = moduleRef.get(MOVIES_MAPPER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch films from SWAPI, map them, and upsert them in the repository', async () => {
    const mockMappedMovies = [
      {
        externalId: mockSwapiResponse.result[0]._id,
        title: mockSwapiResponse.result[0].properties.title,
        director: mockSwapiResponse.result[0].properties.director,
        releaseDate: new Date(
          mockSwapiResponse.result[0].properties.release_date,
        ),
        synopsis: mockSwapiResponse.result[0].properties.opening_crawl,
      },
    ] as Movie[];

    swapiClient.fetchFilms.mockResolvedValue(mockSwapiResponse);
    moviesMapper.fromExternalToDomain.mockReturnValue(mockMappedMovies);

    await syncStarWarsMoviesUseCase.execute();

    expect(swapiClient.fetchFilms).toHaveBeenCalled();
    expect(moviesMapper.fromExternalToDomain).toHaveBeenCalledWith(
      mockSwapiResponse,
    );
    expect(movieRepository.upsertByExternalId).toHaveBeenCalledWith(
      mockMappedMovies,
    );
  });

  it('should do nothing if SWAPI returns no films', async () => {
    const mockSwapiResponse = { result: [] };

    swapiClient.fetchFilms.mockResolvedValue(mockSwapiResponse);

    await syncStarWarsMoviesUseCase.execute();

    expect(swapiClient.fetchFilms).toHaveBeenCalled();
    expect(moviesMapper.fromExternalToDomain).not.toHaveBeenCalled();
    expect(movieRepository.upsertByExternalId).not.toHaveBeenCalled();
  });

  it('should do nothing if the mapper returns no movies', async () => {
    swapiClient.fetchFilms.mockResolvedValue(mockSwapiResponse);
    moviesMapper.fromExternalToDomain.mockReturnValue([]);

    await syncStarWarsMoviesUseCase.execute();

    expect(swapiClient.fetchFilms).toHaveBeenCalled();
    expect(moviesMapper.fromExternalToDomain).toHaveBeenCalledWith(
      mockSwapiResponse,
    );
    expect(movieRepository.upsertByExternalId).not.toHaveBeenCalled();
  });

  it('should do nothing if SWAPI client returns null', async () => {
    swapiClient.fetchFilms.mockResolvedValue(null);
    await syncStarWarsMoviesUseCase.execute();
    expect(swapiClient.fetchFilms).toHaveBeenCalled();
    expect(moviesMapper.fromExternalToDomain).not.toHaveBeenCalled();
    expect(movieRepository.upsertByExternalId).not.toHaveBeenCalled();
  });
});
