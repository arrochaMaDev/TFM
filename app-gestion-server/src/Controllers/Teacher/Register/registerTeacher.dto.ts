import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  asignaturas: string;

  @IsNumber()
  userId: number;
}
