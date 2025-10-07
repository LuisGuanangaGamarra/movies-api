import { Test } from '@nestjs/testing';
import { DeepPartial, Repository } from 'typeorm';
import { MovieTypeOrmRepository } from 'src/movies/infra/repositories/movie.typeorm.repository';
import { MovieOrmEntity } from 'src/movies/infra/orm/movie.orm-entity';
import { MOVIES_MAPPER } from 'src/movies/domain/interfaces/movies.mapper';
import { IMoviesMapper } from 'src/movies/domain/interfaces/movies.mapper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/movies/domain/movie.entity';
import { PaginationParams } from 'src/movies/types';

describe('MovieTypeOrmRepository', () => {
  let mockMovieRepo: MovieTypeOrmRepository;
  let mockRepo: jest.Mocked<Repository<MovieOrmEntity>>;
  let mockMapper: jest.Mocked<IMoviesMapper>;
  const mockGetOneFn = jest.fn<Promise<MovieOrmEntity | null>, []>();

  beforeEach(async () => {
    mockRepo = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: () => mockGetOneFn(),
      })),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    } as DeepPartial<jest.Mocked<Repository<MovieOrmEntity>>> as jest.Mocked<
      Repository<MovieOrmEntity>
    >;

    mockMapper = {
      toListDomain: jest.fn(),
      toDomain: jest.fn(),
      toOrm: jest.fn(),
      toListOrm: jest.fn(),
    } as Partial<jest.Mocked<IMoviesMapper>> as jest.Mocked<IMoviesMapper>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        MovieTypeOrmRepository,
        { provide: getRepositoryToken(MovieOrmEntity), useValue: mockRepo },
        { provide: MOVIES_MAPPER, useValue: mockMapper },
      ],
    }).compile();

    mockMovieRepo = moduleRef.get(MovieTypeOrmRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch paginated movies without pagination params', async () => {
    const moviesOrm: MovieOrmEntity[] = [
      {
        id: 1,
        title: 'Test',
        director: 'Director',
        releaseDate: new Date(),
        synopsis: 'Synopsis',
      } as MovieOrmEntity,
    ];
    const moviesDomain: Movie[] = [
      {
        id: 1,
        title: 'Test',
        director: 'Director',
        releaseDate: new Date(),
        synopsis: 'Synopsis',
        externalId: null,
      },
    ];
    mockRepo.findAndCount.mockResolvedValue([moviesOrm, moviesOrm.length]);
    mockMapper.toListDomain.mockReturnValue(moviesDomain);

    const result = await mockMovieRepo.findAll();

    expect(mockRepo.findAndCount).toHaveBeenCalled();
    expect(mockMapper.toListDomain).toHaveBeenCalledWith(moviesOrm);
    expect(result).toEqual({
      data: moviesDomain,
      total: moviesOrm.length,
    });
  });

  it('should fetch paginated movies with pagination params', async () => {
    const params: PaginationParams = { page: 1, limit: 10 };
    const moviesOrm: MovieOrmEntity[] = [
      {
        id: 1,
        title: 'Test',
        director: 'Director',
        releaseDate: new Date(),
        synopsis: 'Synopsis',
      } as MovieOrmEntity,
    ];
    const moviesDomain: Movie[] = [
      {
        id: 1,
        title: 'Test',
        director: 'Director',
        releaseDate: new Date(),
        synopsis: 'Synopsis',
        externalId: null,
      },
    ];
    mockRepo.findAndCount.mockResolvedValue([moviesOrm, moviesOrm.length]);
    mockMapper.toListDomain.mockReturnValue(moviesDomain);

    const result = await mockMovieRepo.findAll(params);

    expect(mockRepo.findAndCount).toHaveBeenCalledWith({ skip: 0, take: 10 });
    expect(mockMapper.toListDomain).toHaveBeenCalledWith(moviesOrm);
    expect(result).toEqual({
      data: moviesDomain,
      total: moviesOrm.length,
      page: params.page,
      limit: params.limit,
      pages: 1,
    });
  });

  it('should find a movie by ID', async () => {
    const movieOrm = { id: 1, title: 'Test' } as MovieOrmEntity;
    const movieDomain = { id: 1, title: 'Test' } as Movie;
    mockRepo.findOne.mockResolvedValue(movieOrm);
    mockMapper.toDomain.mockReturnValue(movieDomain);

    const result = await mockMovieRepo.findById(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockMapper.toDomain).toHaveBeenCalledWith(movieOrm);
    expect(result).toEqual(movieDomain);
  });

  it('should return null if movie by ID is not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await mockMovieRepo.findById(1);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toBeNull();
  });

  it('should find a movie by title', async () => {
    const movieOrm = { id: 1, title: 'Test' } as MovieOrmEntity;
    const movieDomain = { id: 1, title: 'Test' } as Movie;
    mockRepo.findOne.mockResolvedValue(movieOrm);
    mockMapper.toDomain.mockReturnValue(movieDomain);

    const result = await mockMovieRepo.findByTitle(movieDomain.title);

    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: { title: movieDomain.title },
    });
    expect(mockMapper.toDomain).toHaveBeenCalledWith(movieOrm);
    expect(result).toEqual(movieDomain);
  });

  it('should return null if movie by title is not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await mockMovieRepo.findByTitle('test');
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { title: 'test' } });
    expect(mockMapper.toDomain).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should save a movie', async () => {
    const movieDomain = { id: 1, title: 'Test' } as Movie;
    const movieOrm = { id: 1, title: 'Test' } as MovieOrmEntity;
    mockMapper.toOrm.mockReturnValue(movieOrm);
    mockRepo.create.mockReturnValue(movieOrm);
    mockRepo.save.mockResolvedValue(movieOrm);

    await mockMovieRepo.save(movieDomain);

    expect(mockMapper.toOrm).toHaveBeenCalledWith(movieDomain);
    expect(mockRepo.save).toHaveBeenCalledWith(movieOrm);
    expect(mockRepo.create).toHaveBeenCalledWith(movieOrm);
  });

  it('should save a movie with id', async () => {
    const movieDomain = { title: 'Test' } as Movie;
    const movieOrm = { title: 'Test' } as MovieOrmEntity;
    mockMapper.toOrm.mockReturnValue(movieOrm);
    mockRepo.create.mockReturnValue(movieOrm);
    mockRepo.save.mockResolvedValue(movieOrm);

    await mockMovieRepo.save(movieDomain);

    expect(mockMapper.toOrm).toHaveBeenCalledWith(movieDomain);
    expect(mockRepo.save).toHaveBeenCalledWith(movieOrm);
    expect(mockRepo.create).toHaveBeenCalledWith(movieOrm);
  });

  it('should remove a movie by ID', async () => {
    await mockMovieRepo.remove(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should upsert movies by externalId', async () => {
    const moviesDomain = [{ id: 1, title: 'Test' }] as Movie[];
    const moviesOrm = [{ id: 1, title: 'Test' }] as MovieOrmEntity[];
    mockMapper.toListOrm.mockReturnValue(moviesOrm);

    await mockMovieRepo.upsertByExternalId(moviesDomain);
    expect(mockMapper.toListOrm).toHaveBeenCalledWith(moviesDomain);
    expect(mockRepo.upsert).toHaveBeenCalledWith(moviesOrm, ['externalId']);
  });

  it('should check if a movie has same title', async () => {
    const movieOrm = { id: 1, title: 'Test' } as MovieOrmEntity;
    mockGetOneFn.mockResolvedValue(movieOrm);
    await mockMovieRepo.findByTitleAndDifferentId('Test', 2);
    expect(mockGetOneFn).toHaveBeenCalled();
    expect(mockMapper.toDomain).toHaveBeenCalledWith(movieOrm);
  });

  it("should check if a movie hasn't same title", async () => {
    mockGetOneFn.mockResolvedValue(null);
    await mockMovieRepo.findByTitleAndDifferentId('Test', 2);
    expect(mockGetOneFn).toHaveBeenCalled();
    expect(mockMapper.toDomain).not.toHaveBeenCalledWith();
  });

  it('should update a movie by id', async () => {
    const movieDomain = { id: 1, title: 'Test' };
    const movieOrm = { ...movieDomain } as MovieOrmEntity;
    mockMapper.toOrm.mockReturnValue(movieOrm);
    mockRepo.create.mockReturnValue(movieOrm);
    await mockMovieRepo.update(movieDomain);
    expect(mockRepo.save).toHaveBeenCalledWith(movieOrm);
    expect(mockMapper.toOrm).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
