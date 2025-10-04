import { IsEmail, IsString, MaxLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(320)
  password: string;
}

export class AuthResponseDto {
  token: string;
}
