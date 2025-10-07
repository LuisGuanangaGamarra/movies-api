import { Test } from '@nestjs/testing';

import { DeleteMovieUseCase } from 'src/movies/aplication/use-cases/delete-movie.usecase';
import {
  IMovieRepository,
  MOVIE_REPOSITORY,
} from 'src/movies/domain/repositories/movie.repository';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { movieMock } from '../../shared/mocks/movie.mock';

describe('DeleteMovieUseCase', () => {
  let deleteMovieUseCase: DeleteMovieUseCase;
  let movieRepository: jest.Mocked<IMovieRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteMovieUseCase,
        {
          provide: MOVIE_REPOSITORY,
          useValue: {
            findById: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteMovieUseCase = moduleRef.get<DeleteMovieUseCase>(DeleteMovieUseCase);
    movieRepository = moduleRef.get(MOVIE_REPOSITORY);
  });

  it('should delete a movie when it exists', async () => {
    const movieId = 1;
    movieRepository.findById.mockResolvedValue(movieMock);

    await deleteMovieUseCase.execute(movieId);
    expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
    expect(movieRepository.remove).toHaveBeenCalledWith(movieId);
  });

  it('should throw a DomainException if the movie does not exist', async () => {
    const movieId = 999;
    movieRepository.findById.mockResolvedValue(null);

    await expect(deleteMovieUseCase.execute(movieId)).rejects.toThrow(
      new DomainException(
        'MOVIE_NOT_FOUND_FOR_DELETE',
        'Pelicula no encontrada para eliminar',
      ),
    );

    expect(movieRepository.findById).toHaveBeenCalledWith(movieId);
    expect(movieRepository.remove).not.toHaveBeenCalled();
  });
});
