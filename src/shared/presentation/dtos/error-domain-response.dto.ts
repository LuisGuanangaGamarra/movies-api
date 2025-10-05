import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDomainResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica que la operación falló',
  })
  success!: boolean;

  @ApiProperty({
    example: 'EMAIL_ALREADY_EXISTS',
    description: 'Código del error de dominio o validación',
  })
  code!: string;

  @ApiProperty({
    example: 'El correo electrónico ya está registrado',
    description: 'Mensaje legible que describe el error ocurrido',
  })
  message!: string;

  @ApiPropertyOptional({
    example: { field: 'email' },
    description:
      'Contexto opcional con detalles adicionales del error (campo, ID, etc.)',
  })
  context?: Record<string, unknown>;

  @ApiProperty({
    example: '2025-10-04T18:33:22.000Z',
    description: 'Marca de tiempo ISO del momento en que ocurrió el error',
  })
  timestamp!: string;
}
