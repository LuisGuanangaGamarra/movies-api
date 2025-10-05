import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMovieRepository } from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/movie.entity';
import { MovieOrmEntity } from '../orm/movie.orm-entity';
import { MovieMapper } from '../mappers/movie.mappers';
import { PaginatedResult, PaginationParams } from '../../types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieTypeOrmRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieOrmEntity)
    private readonly repo: Repository<MovieOrmEntity>,
  ) {}

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Movie>> {
    const { page, limit } = params || {};

    if (!page || !limit) {
      const rows = await this.repo.find();
      const rowsMapped = rows.map((row) => MovieMapper.toDomain(row));

      return {
        data: rowsMapped,
        total: rowsMapped.length,
      };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await this.repo.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: data.map((row) => MovieMapper.toDomain(row)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Movie | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? MovieMapper.toDomain(row) : null;
  }

  async findByTitle(title: string): Promise<Movie | null> {
    const row = await this.repo.findOne({ where: { title } });
    return row ? MovieMapper.toDomain(row) : null;
  }

  async save(movie: Movie | Omit<Movie, 'id'>): Promise<void> {
    const movieEntity = MovieMapper.toOrmWithOutId(movie);

    if ('id' in movie) {
      movieEntity.id = movie.id;
    }

    const entity = this.repo.create({
      ...movieEntity,
    });

    await this.repo.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async upsertByExternalId(movies: Omit<Movie, 'id'>[]): Promise<void> {
    const entities = movies.map((movie) => MovieMapper.toOrmWithOutId(movie));
    await this.repo.upsert(entities, ['externalId']);
  }
}
