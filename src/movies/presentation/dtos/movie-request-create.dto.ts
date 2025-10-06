import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieRequestCreateDto {
  @ApiProperty({
    type: String,
    example: 'El inicio del jedi',
    description: 'titulo de la pelicula',
    required: true,
  })
  @IsNotEmpty({
    message: 'El titulo es requerido',
  })
  @IsString({
    message: 'El titulo debe ser un string',
  })
  @MaxLength(200, {
    message: 'El titulo no puede tener mas de 200 caracteres',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Luke Skywalker',
    description: 'director de la pelicula',
    required: true,
  })
  @IsNotEmpty({
    message: 'El nombre del o de los directores es requerido',
  })
  @IsString({
    message: 'El nombre del o de los directores debe ser un string',
  })
  @MaxLength(200, {
    message: 'campo director no puede tener mas de 200 caracteres',
  })
  director: string;

  @ApiProperty({
    type: String,
    format: 'dd-mm-yyyy',
    example: '22-01-2022',
    description: 'año de estreno de la pelicula',
    required: true,
  })
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string' || value.trim() === '') return null;
    const match = value.match(
      /^(0[1-9]|[1-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/,
    );
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return date;
  })
  @IsNotEmpty({
    message: 'La fecha de estreno es requerida',
  })
  @IsDate({
    message: 'no es una fecha valida',
  })
  releaseDate: Date;

  @ApiProperty({
    type: String,
    example: 'Regresa a la forja de Jabba',
    description: 'descripcion de la pelicula',
    required: true,
  })
  @IsNotEmpty({
    message: 'La descripcion es requerida',
  })
  @IsString({
    message: 'La descripcion debe ser un string',
  })
  synopsis: string;
}
