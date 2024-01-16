import { IsNumber } from 'class-validator';

export class RegisterSubjectTeacherDto {
  @IsNumber()
  asignatura: number;

  @IsNumber()
  profesor: number;
}
