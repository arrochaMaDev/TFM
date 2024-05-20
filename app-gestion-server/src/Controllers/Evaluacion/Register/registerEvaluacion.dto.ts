import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RegisterEvaluacionDto {
  @IsNumber()
  matricula: number;

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
