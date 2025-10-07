import { Test } from '@nestjs/testing';
import { CreateMovieUseCase } from 'src/movies/aplication/use-cases/create-movie.usecase';
import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from 'src/movies/domain/repositories/movie.repository';
import {
  IMoviesMapper,
  MOVIES_MAPPER,
} from 'src/movies/domain/interfaces/movies.mapper';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { Movie } from '../../../../src/movies/domain/movie.entity';
import { movieMock } from '../../shared/mocks/movie.mock';
import { MovieInputDto } from '../../../../src/movies/aplication/use-cases/dtos/movie-input.dto';

describe('CreateMovieUseCase', () => {
  let createMovieUseCase: CreateMovieUseCase;
  let movieRepository: jest.Mocked<IMovieRepository>;
  let moviesMapper: jest.Mocked<IMoviesMapper>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateMovieUseCase,
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            findByTitle: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MOVIES_MAPPER,
          useValue: {
            fromInputToDomain: jest.fn(),
          },
        },
      ],
    }).compile();

    createMovieUseCase = moduleRef.get<CreateMovieUseCase>(CreateMovieUseCase);
    movieRepository = moduleRef.get(MOVIE_REPOSITORY);
    moviesMapper = moduleRef.get(MOVIES_MAPPER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a movie when it does not exist', async () => {
    const domainMovie = { ...movieMock } as Movie;
    const movieInput = { ...movieMock } as MovieInputDto;
    moviesMapper.fromInputToDomain.mockReturnValue(domainMovie);
    movieRepository.findByTitle.mockResolvedValue(null);

    await createMovieUseCase.execute(movieInput);

    expect(moviesMapper.fromInputToDomain).toHaveBeenCalledWith(movieMock);
    expect(movieRepository.findByTitle).toHaveBeenCalledWith(movieMock.title);
    expect(movieRepository.save).toHaveBeenCalledWith(domainMovie);
  });

  it('should throw a DomainException if the movie already exists', async () => {
    const domainMovie = { ...movieMock } as Movie;
    const movieInput = { ...movieMock } as MovieInputDto;
    moviesMapper.fromInputToDomain.mockReturnValue(domainMovie);
    movieRepository.findByTitle.mockResolvedValue(domainMovie);

    await expect(createMovieUseCase.execute(movieInput)).rejects.toThrow(
      new DomainException(
        'MOVIE_TITLE_ALREADY_EXISTS',
        'Pelicula con ese nombre ya se encuentra registrada',
      ),
    );

    expect(moviesMapper.fromInputToDomain).toHaveBeenCalledWith(movieMock);
    expect(movieRepository.findByTitle).toHaveBeenCalledWith(movieMock.title);
    expect(movieRepository.save).not.toHaveBeenCalled();
  });
});
