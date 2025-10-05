import { Movie } from '../../domain/movie.entity';
import { SawpiResponseDTO } from './types';

export class ExternalMovieMapper {
  static toDomain(dto: SawpiResponseDTO): Omit<Movie, 'id'>[] {
    if (!dto) return [];

    return dto.result.map(({ properties, _id }) => ({
      title: properties.title,
      director: properties.director,
      releaseDate: new Date(properties.release_date),
      synopsis: properties.opening_crawl,
      externalId: _id,
    }));
  }
}
