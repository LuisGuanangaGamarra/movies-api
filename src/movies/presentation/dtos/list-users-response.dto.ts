import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';

export class ListUsersResponseDto {
  @ApiProperty({
    type: [MovieDto],
    description: 'Lista de peliculas',
    isArray: true,
    required: true,
  })
  @Expose()
  @Type(() => MovieDto)
  movies: MovieDto[];

  @ApiProperty({
    type: Number,
    example: 0,
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
    example: 1,
    description: 'cuántos registros se muestran por página.',
  })
  @Expose()
  limit?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'total de paginas',
  })
  @Expose()
  pages?: number;
}
