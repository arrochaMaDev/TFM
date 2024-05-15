import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  Max,
  Min,
  IsOptional,
} from 'class-validator';

export class RegisterStudentDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString() // validar para que sea en formato 12345678X????
  @IsNotEmpty()
  dni: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  // @IsNumber()
  @IsNotEmpty() // validado para que sea un número de 9 dígitos (entre 100000000 y 999999999) y en formato 123456789
  // @Min(100000000)
  // @Max(999999999)
  telefono: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @IsString()
  @IsOptional()
  foto: any;
  // @Type(() => File)
  // foto: File;

  // @IsNumber()
  userId: number;
}
