import { Test } from '@nestjs/testing';
import { UpdateMovieUsecase } from 'src/movies/aplication/use-cases/update-movie.usecase';
import {
  IMovieRepository,
  MOVIE_REPOSITORY,
} from 'src/movies/domain/repositories/movie.repository';
import {
  IMoviesMapper,
  MOVIES_MAPPER,
} from 'src/movies/domain/interfaces/movies.mapper';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { movieInputMockDto } from '../../shared/mocks/movie-input.mock';
import { Movie } from '../../../../src/movies/domain/movie.entity';

describe('UpdateMovieUsecase', () => {
  let updateMovieUsecase: UpdateMovieUsecase;
  let movieRepository: jest.Mocked<IMovieRepository>;
  let moviesMapper: jest.Mocked<IMoviesMapper>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateMovieUsecase,
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            findByTitleAndDifferentId: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
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

    updateMovieUsecase = moduleRef.get<UpdateMovieUsecase>(UpdateMovieUsecase);
    movieRepository = moduleRef.get(MOVIE_REPOSITORY);
    moviesMapper = moduleRef.get(MOVIES_MAPPER);
  });

  it('should update a movie successfully when no title conflict exists', async () => {
    const domainMovie = { ...movieInputMockDto } as Movie;

    moviesMapper.fromInputToDomain.mockReturnValue(domainMovie);
    movieRepository.findByTitleAndDifferentId.mockResolvedValue(null);
    movieRepository.findById.mockResolvedValue(domainMovie);

    await updateMovieUsecase.execute(movieInputMockDto);

    expect(moviesMapper.fromInputToDomain).toHaveBeenCalledWith(
      movieInputMockDto,
    );
    expect(movieRepository.findByTitleAndDifferentId).toHaveBeenCalledWith(
      movieInputMockDto.title,
      movieInputMockDto.id,
    );
    expect(movieRepository.update).toHaveBeenCalledWith(domainMovie);
  });

  it('should throw a DomainException when a movie with the same title but different ID exists', async () => {
    const domainMovie = { ...movieInputMockDto } as Movie;

    moviesMapper.fromInputToDomain.mockReturnValue(domainMovie);
    movieRepository.findById.mockResolvedValue(domainMovie);
    movieRepository.findByTitleAndDifferentId.mockResolvedValue({
      ...domainMovie,
      id: 123,
    });

    await expect(updateMovieUsecase.execute(movieInputMockDto)).rejects.toThrow(
      new DomainException(
        'MOVIE_TITLE_ALREADY_EXISTS',
        'Pelicula con ese nombre ya se encuentra registrada',
      ),
    );

    expect(moviesMapper.fromInputToDomain).toHaveBeenCalledWith(
      movieInputMockDto,
    );
    expect(movieRepository.findByTitleAndDifferentId).toHaveBeenCalledWith(
      movieInputMockDto.title,
      movieInputMockDto.id,
    );
    expect(movieRepository.update).not.toHaveBeenCalled();
  });

  it('should throw a DomainException when the movie to update does not exist', async () => {
    const domainMovie = { ...movieInputMockDto } as Movie;

    moviesMapper.fromInputToDomain.mockReturnValue(domainMovie);
    movieRepository.findById.mockResolvedValue(null);
    await expect(updateMovieUsecase.execute(movieInputMockDto)).rejects.toThrow(
      new DomainException('MOVIE_NOT_FOUND', 'Pelicula no encontrada'),
    );
    expect(moviesMapper.fromInputToDomain).toHaveBeenCalledWith(
      movieInputMockDto,
    );
  });
});
