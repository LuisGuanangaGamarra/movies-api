import { Movie } from '../../../../src/movies/domain/movie.entity';

export const movieMock: Movie = {
  id: 1,
  title: 'Test Movie',
  director: 'Test Director',
  releaseDate: new Date(),
  synopsis: 'Test Synopsis',
  externalId: 'test-external-id',
};
