import { MovieMapper } from 'src/movies/infra/mappers/movies-mappers/movie.mapper';
import { Movie } from 'src/movies/domain/movie.entity';
import { MovieOrmEntity } from 'src/movies/infra/orm/movie.orm-entity';
import { MovieInputDto } from 'src/movies/aplication/use-cases/dtos/movie-input.dto';
import { MovieRequestCreateDto } from 'src/movies/presentation/dtos/movie-request-create.dto';
import { MovieRequestUpdateDto } from 'src/movies/presentation/dtos/movie-request-update.dto';
import { ListUserRequestDto } from 'src/movies/presentation/dtos/list-user-request.dto';
import { PaginatedResult, PaginationParams } from 'src/movies/types';
import { movieMock } from '../../../../shared/mocks/movie.mock';
import { SawpiResponseDTO } from '../../../../../../src/movies/infra/swapi/types';
import { MovieResponseDto } from '../../../../../../src/movies/presentation/dtos/movie-response.dto';

const mockMorphismFunc = jest.fn<unknown, unknown[]>();
jest.mock('morphism', () => ({
  morphism: (...arg: unknown[]) => mockMorphismFunc(...arg),
}));

describe('MovieMapper Unit Tests', () => {
  let movieMapper: MovieMapper;

  beforeEach(() => {
    movieMapper = new MovieMapper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should map ListUserRequestDto to PaginationParams (toInput)', () => {
    const dto: ListUserRequestDto = {
      page: 1,
      limit: 10,
    };

    const paginationParams: PaginationParams = {
      ...dto,
    };

    mockMorphismFunc.mockReturnValue(paginationParams);

    const result = movieMapper.toInput(dto);

    expect(result).toEqual(paginationParams);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['requestToInputSchema'],
      dto,
    );
  });

  it('should map PaginatedResult<Movie> to ListMoviesResponseDto (toOutput)', () => {
    const data: PaginatedResult<Movie> = {
      data: [movieMock],
      total: 1,
    };

    const response = {
      data: [movieMock],
      total: 1,
    };

    mockMorphismFunc.mockReturnValue(response);
    const result = movieMapper.toOutput(data);

    expect(result).toEqual(response);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['outputToResponseSchema'],
      data,
    );
  });

  it('should map MovieOrmEntity[] to Movie[] (toListDomain)', () => {
    const ormEntities: MovieOrmEntity[] = [
      {
        ...movieMock,
        createAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const domainMovies = [
      new Movie(
        movieMock.id,
        movieMock.title,
        movieMock.director,
        movieMock.releaseDate,
        movieMock.synopsis,
        movieMock.externalId,
      ),
    ];

    mockMorphismFunc.mockReturnValue(domainMovies);

    const result = movieMapper.toListDomain(ormEntities);

    expect(result).toEqual(domainMovies);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['toDomainSchema'],
      ormEntities,
      Movie,
    );
  });

  it('should map MovieOrmEntity to Movie (toDomain)', () => {
    const ormEntity: MovieOrmEntity = new MovieOrmEntity();
    ormEntity.id = movieMock.id;
    ormEntity.title = movieMock.title;
    ormEntity.director = movieMock.director;
    ormEntity.releaseDate = movieMock.releaseDate;
    ormEntity.synopsis = movieMock.synopsis;
    ormEntity.externalId = null;
    ormEntity.createAt = new Date();
    ormEntity.updatedAt = new Date();

    const domainMovie = new Movie(
      ormEntity.id,
      ormEntity.title,
      ormEntity.director,
      ormEntity.releaseDate,
      ormEntity.synopsis,
      ormEntity.externalId ?? null,
    );

    mockMorphismFunc.mockReturnValue(domainMovie);

    const result = movieMapper.toDomain(ormEntity);

    expect(result).toEqual(domainMovie);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['toDomainSchema'],
      ormEntity,
      Movie,
    );
  });

  it('should map Movie to MovieOrmEntity (toOrm)', () => {
    const domainMovie: Movie = movieMock;

    const ormEntity: MovieOrmEntity = {
      ...movieMock,
      createAt: new Date(),
      updatedAt: new Date(),
    };

    mockMorphismFunc.mockReturnValue(ormEntity);

    const result = movieMapper.toOrm(domainMovie);

    expect(result).toEqual(ormEntity);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['toOrmSchema'],
      domainMovie,
      MovieOrmEntity,
    );
  });

  it('should map MovieRequestCreateDto to MovieInputDto (fromRequestCreateToMovieInput)', () => {
    const dto: MovieRequestCreateDto = {
      ...movieMock,
    };

    const inputDto: MovieInputDto = {
      ...dto,
    };

    mockMorphismFunc.mockReturnValue(inputDto);

    const result = movieMapper.fromRequestCreateToMovieInput(dto);

    expect(result).toEqual(inputDto);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['fromRequestCreatetoInputSchema'],
      dto,
      MovieInputDto,
    );
  });

  it('should map MovieRequestUpdateDto to MovieInputDto (fromRequestUpdateToMovieInput)', () => {
    const dto: MovieRequestUpdateDto = {
      id: 1,
      title: 'Updated Movie',
      director: 'Updated Director',
    };

    const inputDto: MovieInputDto = {
      ...dto,
    };

    mockMorphismFunc.mockReturnValue(inputDto);
    const result = movieMapper.fromRequestUpdateToMovieInput(dto);

    expect(result).toEqual(inputDto);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['fromRequestUpdatetoInputSchema'],
      dto,
      MovieInputDto,
    );
  });

  describe('toListOrm', () => {
    it('should map Movie[] to MovieOrmEntity[]', () => {
      const movies: Movie[] = [
        new Movie(
          1,
          'Star Wars',
          'George Lucas',
          new Date('1977-05-25'),
          'A long time ago in a galaxy far, far away...',
          '123',
        ),
      ];

      const ormEntities: MovieOrmEntity[] = [
        {
          id: 1,
          title: 'Star Wars',
          director: 'George Lucas',
          releaseDate: new Date('1977-05-25'),
          synopsis: 'A long time ago in a galaxy far, far away...',
          externalId: '123',
          createAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMorphismFunc.mockReturnValue(ormEntities);

      const result = movieMapper.toListOrm(movies);
      expect(result).toEqual(ormEntities);
      expect(mockMorphismFunc).toHaveBeenCalledWith(
        movieMapper['toOrmSchema'],
        movies,
        MovieOrmEntity,
      );
    });
  });

  describe('fromExternalToDomain', () => {
    it('should map SawpiResponseDTO to Movie[]', () => {
      const swapiResponse: SawpiResponseDTO = {
        result: [
          {
            properties: {
              title: 'Star Wars',
              director: 'George Lucas',
              release_date: '1977-05-25',
              opening_crawl: 'A long time ago in a galaxy far, far away...',
            },
            _id: '1',
          },
        ],
      };

      const domainMovies: Movie[] = [
        new Movie(
          1,
          'Star Wars',
          'George Lucas',
          new Date('1977-05-25'),
          'A long time ago in a galaxy far, far away...',
          '1',
        ),
      ];

      mockMorphismFunc.mockReturnValue(domainMovies);

      const result = movieMapper.fromExternalToDomain(swapiResponse);

      expect(result).toEqual(domainMovies);
      expect(mockMorphismFunc).toHaveBeenCalledWith(
        movieMapper['fromExternalToDomainSchema'],
        swapiResponse.result,
        Movie,
      );
    });
  });

  describe('toMovieResponse', () => {
    it('should map Movie to MovieResponseDto', () => {
      const movie: Movie = new Movie(
        1,
        'Star Wars',
        'George Lucas',
        new Date('1977-05-25'),
        'A long time ago in a galaxy far, far away...',
        '123',
      );

      const movieResponse: MovieResponseDto = {
        id: 1,
        title: 'Star Wars',
        director: 'George Lucas',
        releaseDate: new Date('1977-05-25'),
        synopsis: 'A long time ago in a galaxy far, far away...',
      };

      mockMorphismFunc.mockReturnValue(movieResponse);

      const result = movieMapper.toMovieResponse(movie);
      expect(result).toEqual(movieResponse);
      expect(mockMorphismFunc).toHaveBeenCalledWith(
        movieMapper['toMovieResponseSchema'],
        movie,
      );
    });
  });

  it('should map MovieInputDto to Movie (fromInputToDomain)', () => {
    const inputDto: MovieInputDto = {
      id: 1,
      title: 'Star Wars',
      director: 'George Lucas',
      releaseDate: new Date('1977-05-25'),
      synopsis: 'A long time ago in a galaxy far, far away...',
      externalId: '123',
    };

    const expectedDomainMovie: Movie = new Movie(
      1,
      'Star Wars',
      'George Lucas',
      new Date('1977-05-25'),
      'A long time ago in a galaxy far, far away...',
      '123',
    );

    mockMorphismFunc.mockReturnValue(expectedDomainMovie);

    const result = movieMapper.fromInputToDomain(inputDto);

    expect(result).toEqual(expectedDomainMovie);
    expect(mockMorphismFunc).toHaveBeenCalledWith(
      movieMapper['fromInputToDomainSchema'],
      inputDto,
      Movie,
    );
  });
});
