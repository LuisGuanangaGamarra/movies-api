import { IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListUserRequestDto {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'número de página actual',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'cuántos registros quieres mostrar por página.',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
