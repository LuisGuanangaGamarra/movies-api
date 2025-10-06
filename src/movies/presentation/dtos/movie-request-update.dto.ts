import { Transform } from 'class-transformer';
import {
  Matches,
  IsNotEmpty,
  MaxLength,
  IsString,
  IsOptional,
  IsNumber,
  Min,
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
  @IsNumber()
  @Min(1)
  id: number;

  @ApiProperty({
    type: String,
    example: 'El inicio del jedi',
    description: 'titulo de la pelicula',
    required: false,
  })
  @IsOptional()
  @IsString()
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
  @IsString()
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
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'La fecha debe tener el formato dd-mm-yyyy',
  })
  @Transform(({ value }) => {
    const match = (value as string).match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return date;
  })
  releaseDate?: Date;

  @ApiProperty({
    type: String,
    example: 'Regresa a la forja de Jabba',
    description: 'descripcion de la pelicula',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  synopsis?: string;
}
