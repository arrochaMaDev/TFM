import { IsNumber } from 'class-validator';

export class RegisterMatriculaDto {
  @IsNumber()
  alumno: number;

  @IsNumber()
  asignatura: number;

  @IsNumber()
  profesor: number;

  @IsNumber()
  year: number;
}
