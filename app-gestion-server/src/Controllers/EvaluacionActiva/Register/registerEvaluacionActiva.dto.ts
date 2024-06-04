import { IsNumber } from 'class-validator';

export class RegisterEvaluacionActivaDto {
  @IsNumber()
  evaluacion1: number;

  @IsNumber()
  evaluacion2: number;

  @IsNumber()
  evaluacion3: number;
}
