import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AtLeastOneDefined } from '../../../shared/presentation/validators/at-least-one-defined.decorator';

@AtLeastOneDefined(['title', 'director', 'releaseDate', 'synopsis'])
export class MovieRequestUpdateDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Id de la pelicula',
    required: true,
  })
  @IsNumber({}, { message: 'El id debe ser un numero' })
  @Min(1, { message: 'El id debe ser mayor a 0' })
  id: number;

  @ApiProperty({
    type: String,
    example: 'El inicio del jedi',
    description: 'titulo de la pelicula',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'El titulo debe ser un string',
  })
  @IsNotEmpty({
    message: 'El titulo es requerido',
  })
  @MaxLength(200, {
    message: 'El titulo no puede tener mas de 200 caracteres',
  })
  title?: string;

  @ApiProperty({
    type: String,
    example: 'Luke Skywalker',
    description: 'director de la pelicula',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'El nombre del o de los directores debe ser un string',
  })
  @IsNotEmpty({
    message: 'El nombre del o de los directores es requerido',
  })
  @MaxLength(200, {
    message: 'campo director no puede tener mas de 200 caracteres',
  })
  director?: string;

  @ApiProperty({
    type: String,
    format: 'dd-mm-yyyy',
    example: '22-01-2022',
    description: 'año de estreno de la pelicula',
    required: false,
  })
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string' || value.trim() === '')
      return undefined;
    const match = value.match(
      /^(0[1-9]|[1-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/,
    );
    if (!match) return undefined;
    const [, dd, mm, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return date;
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'La fecha de estreno es requerida',
  })
  @IsDate({
    message: 'no es una fecha valida',
  })
  releaseDate?: Date;

  @ApiProperty({
    type: String,
    example: 'Regresa a la forja de Jabba',
    description: 'descripcion de la pelicula',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'La descripcion es requerida',
  })
  @IsString({
    message: 'La descripcion debe ser un string',
  })
  synopsis?: string;
}
