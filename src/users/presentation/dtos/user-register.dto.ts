import { IsEmail, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty({
    type: String,
    example: 'user@example.com',
    description: 'Correo electrónico del usuario',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '123456789',
    description: 'contraseña del usuario',
    required: true,
  })
  @IsString()
  @MaxLength(320)
  password: string;
}
