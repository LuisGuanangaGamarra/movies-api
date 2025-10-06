import { Test } from '@nestjs/testing';
import { ListMoviesUseCase } from 'src/movies/aplication/use-cases/list-movies.usecase';
import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from 'src/movies/domain/repositories/movie.repository';
import { Movie } from 'src/movies/domain/movie.entity';
import { PaginatedResult, PaginationParams } from 'src/movies/types';
import { movieMock } from '../../shared/mocks/movie.mock';

let listMoviesUseCase: ListMoviesUseCase;
let movieRepository: jest.Mocked<IMovieRepository>;
const movie = movieMock;

describe('ListMoviesUseCase', () => {
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListMoviesUseCase,
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    listMoviesUseCase = moduleRef.get<ListMoviesUseCase>(ListMoviesUseCase);
    movieRepository = moduleRef.get<
      IMovieRepository,
      jest.Mocked<IMovieRepository>
    >(MOVIE_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call movieRepository.findAll without parameters', async () => {
    const paginationParams: PaginationParams = {};
    const mockPaginatedResult: PaginatedResult<Movie> = {
      data: [movie],
      total: 1,
    };

    movieRepository.findAll.mockResolvedValue(mockPaginatedResult);

    const result = await listMoviesUseCase.execute(paginationParams);

    expect(movieRepository.findAll).toHaveBeenCalledWith(paginationParams);
    expect(movieRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPaginatedResult);
  });

  it('should call movieRepository.findAll with parameters', async () => {
    const paginationParams: PaginationParams = {
      page: 1,
      limit: 2,
    };
    const mockPaginatedResult: PaginatedResult<Movie> = {
      data: [movie, movie],
      total: 2,
      ...paginationParams,
    };

    movieRepository.findAll.mockResolvedValue(mockPaginatedResult);

    const result = await listMoviesUseCase.execute(paginationParams);

    expect(movieRepository.findAll).toHaveBeenCalledWith(paginationParams);
    expect(movieRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPaginatedResult);
  });
});
