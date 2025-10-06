import { IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListUserRequestDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'número de página actual',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'cuántos registros quieres mostrar por página.',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
