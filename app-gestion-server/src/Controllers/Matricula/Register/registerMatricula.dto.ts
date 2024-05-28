import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterMatriculaDto {
  @IsNumber()
  alumno: number;

  @IsNumber()
  asignatura: number;

  @IsNumber()
  profesor: number;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsNumber()
  nota1: number;

  @IsOptional()
  @IsString()
  comentario1: string;

  @IsOptional()
  @IsNumber()
  nota2: number;

  @IsOptional()
  @IsString()
  comentario2: string;

  @IsOptional()
  @IsNumber()
  nota3: number;

  @IsOptional()
  @IsString()
  comentario3: string;
}
