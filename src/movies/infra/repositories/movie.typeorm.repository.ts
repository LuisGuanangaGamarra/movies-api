import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMovieRepository } from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/movie.entity';
import { MovieOrmEntity } from '../orm/movie.orm-entity';
import { PaginatedResult, PaginationParams, PartialExcept } from '../../types';
import { Injectable, Inject } from '@nestjs/common';
import {
  type IMoviesMapper,
  MOVIES_MAPPER,
} from '../../domain/interfaces/movies.mapper';

@Injectable()
export class MovieTypeOrmRepository implements IMovieRepository {
  constructor(
    @InjectRepository(MovieOrmEntity)
    // istanbul ignore next
    private readonly repo: Repository<MovieOrmEntity>,
    @Inject(MOVIES_MAPPER)
    // istanbul ignore next
    private readonly movieMapper: IMoviesMapper,
  ) {}

  async findAll(params?: PaginationParams): Promise<PaginatedResult<Movie>> {
    const { page, limit } = params || {};

    if (!page || !limit) {
      const [rows, total] = await this.repo.findAndCount();
      const rowsMapped = this.movieMapper.toListDomain(rows);

      return {
        data: rowsMapped,
        total: total,
      } as PaginatedResult<Movie>;
    }

    const skip = (page - 1) * limit;
    const [rows, total] = await this.repo.findAndCount({
      skip,
      take: limit,
    });

    const rowsMapped = this.movieMapper.toListDomain(rows);

    return {
      data: rowsMapped,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Movie | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.movieMapper.toDomain(row) : null;
  }

  async findByTitle(title: string): Promise<Movie | null> {
    const row = await this.repo.findOne({ where: { title } });
    return row ? this.movieMapper.toDomain(row) : null;
  }

  async findByTitleAndDifferentId(
    title: string,
    id: number,
  ): Promise<Movie | null> {
    const row = await this.repo
      .createQueryBuilder('movie')
      .where('movie.title = :title', { title })
      .andWhere('movie.id != :id', { id })
      .getOne();
    return row ? this.movieMapper.toDomain(row) : null;
  }

  async save(movie: Movie | Omit<Movie, 'id'>): Promise<void> {
    const movieEntity = this.movieMapper.toOrm(movie);

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

  async upsertByExternalId(movies: Movie[]): Promise<void> {
    const entities = this.movieMapper.toListOrm(movies);
    await this.repo.upsert(entities, ['externalId']);
  }

  async update(movie: PartialExcept<Movie, 'id'>): Promise<void> {
    const movieEntity = this.movieMapper.toOrm(movie);
    const entity = this.repo.create({
      ...movieEntity,
    });

    await this.repo.save(entity);
  }
}
