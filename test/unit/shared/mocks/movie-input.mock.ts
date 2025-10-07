import { MovieInputDto } from '../../../../src/movies/aplication/use-cases/dtos/movie-input.dto';

export const movieInputMockDto: MovieInputDto = {
  title: 'New Movie',
  director: 'Jane Doe',
  releaseDate: new Date(),
  synopsis: 'A great movie.',
};
