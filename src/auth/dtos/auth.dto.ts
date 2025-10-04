import { IsEmail, IsString, MaxLength } from 'class-validator';

export class AuthDtoRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(320)
  password: string;
}

export type LoginDtoResponse = {
  token: string;
};
