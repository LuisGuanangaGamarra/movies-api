import { Movie } from '../../domain/movie.entity';
import { MovieOrmEntity } from '../orm/movie.orm-entity';

export class MovieMapper {
  static toDomain(row: MovieOrmEntity): Movie {
    return new Movie(
      row.id,
      row.title,
      row.director,
      row.releaseDate,
      row.synopsis,
      row.externalId ?? null,
    );
  }
  static toOrm(entity: Movie): MovieOrmEntity {
    const row = new MovieOrmEntity();
    row.id = entity.id;
    row.title = entity.title;
    row.director = entity.director;
    row.releaseDate = entity.releaseDate;
    row.synopsis = entity.synopsis;
    row.externalId = entity.externalId;
    return row;
  }

  static toOrmWithOutId(entity: Omit<Movie, 'id'>): MovieOrmEntity {
    const row = new MovieOrmEntity();
    row.title = entity.title;
    row.director = entity.director;
    row.releaseDate = entity.releaseDate;
    row.synopsis = entity.synopsis;
    row.externalId = entity.externalId;
    return row;
  }
}
