import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterTeacherDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
