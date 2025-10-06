import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MovieDTO } from './movie.dto';

export class ListMoviesResponseDto {
  @ApiProperty({
    type: MovieDTO,
    description: 'Lista de peliculas',
    isArray: true,
    required: true,
  })
  @Expose()
  @Type(() => MovieDTO)
  movies: MovieDTO[];

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Numero total de peliculas.',
    required: true,
  })
  @Expose()
  total: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Página actual.',
  })
  @Expose()
  page?: number;

  @ApiProperty({
    type: Number,
    example: 2,
    description: 'cuántos registros se muestran por página.',
  })
  @Expose()
  limit?: number;

  @ApiProperty({
    type: Number,
    example: 4,
    description: 'total de paginas',
  })
  @Expose()
  pages?: number;
}
