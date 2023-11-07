import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  pass: string;

  @IsNumber()
  permiso: number;
}
