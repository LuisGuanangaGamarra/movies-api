import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Id de la pelicula',
    required: true,
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: String,
    example: 'El inicio del jedi',
    description: 'titulo de la pelicula',
    required: true,
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    example: 'Luke Skywalker',
    description: 'director de la pelicula',
    required: true,
  })
  @Expose()
  director: string;

  @ApiProperty({
    type: String,
    format: 'dd-mm-yyyy',
    example: '22-01-2022',
    description: 'año de estreno de la pelicula',
    required: true,
  })
  @Expose()
  @Transform(
    ({ value }) => {
      const date = new Date(value);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    },
    { toPlainOnly: true },
  )
  releaseDate: Date;

  @ApiProperty({
    type: String,
    example: 'Regresa a la forja de Jabba',
    description: 'descripcion de la pelicula',
    required: true,
  })
  @Expose()
  synopsis: string;
}
