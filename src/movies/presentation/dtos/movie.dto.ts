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
  @Transform(({ value }) =>
    value
      ? new Intl.DateTimeFormat('es-EC', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(new Date(value))
      : null,
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
