import { IsNumber } from 'class-validator';

export class RegisterActiveEvaluacionDto {
  @IsNumber()
  activeEval1: number;

  @IsNumber()
  activeEval2: number;

  @IsNumber()
  activeEval3: number;
}
