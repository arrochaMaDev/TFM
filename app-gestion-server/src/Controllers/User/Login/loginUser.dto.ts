import { IsEmail, IsNumber, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  pass: string;
}
