import { Test } from '@nestjs/testing';
import { GetMovieUseCase } from 'src/movies/aplication/use-cases/get-movie.usecase';
import {
  type IMovieRepository,
  MOVIE_REPOSITORY,
} from 'src/movies/domain/repositories/movie.repository';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { movieMock } from '../../shared/mocks/movie.mock';

describe('GetMovieUseCase', () => {
  let getMovieUseCase: GetMovieUseCase;
  let movieRepository: jest.Mocked<IMovieRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetMovieUseCase,
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    getMovieUseCase = moduleRef.get<GetMovieUseCase>(GetMovieUseCase);
    movieRepository = moduleRef.get(MOVIE_REPOSITORY);
  });

  it('should return a movie if it is found', async () => {
    const movieId = 1;

    movieRepository.findById.mockResolvedValue(movieMock);

    const result = await getMovieUseCase.execute(movieId);

    expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
    expect(result).toEqual(movieMock);
    expect(movieId).toEqual(movieMock.id);
  });

  it('should throw a DomainException if the movie is not found', async () => {
    const movieId = 999;
    movieRepository.findById.mockResolvedValue(null);

    await expect(getMovieUseCase.execute(movieId)).rejects.toThrow(
      new DomainException('MOVIE_NOT_FOUND', 'Pelicula no encontrada'),
    );

    expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
  });
});
