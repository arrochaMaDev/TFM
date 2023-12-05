import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterSubjectDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
