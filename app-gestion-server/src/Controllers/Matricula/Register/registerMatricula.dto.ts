import { IsNumber } from 'class-validator';

export class RegisterMatriculaDto {
  @IsNumber()
  alumno: number;

  @IsNumber()
  asignatura: number;

  @IsNumber()
  profesor: number;

  // @IsNumber()
  // nota: number;
  // EL CAMPO NOTA SE RESERVA PARA LA EVALUACION
}
