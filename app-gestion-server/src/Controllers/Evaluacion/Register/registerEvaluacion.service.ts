import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetMatriculaService } from 'src/Controllers/Matricula/Get/getMatricula.service';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';
import { RegisterEvaluacionDto } from './registerEvaluacion.dto';
import { Evaluacion } from 'src/Modelos/Evaluacion/evaluacion';

@Injectable()
export class RegisterEvaluacionService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
    private readonly getMatriculaService: GetMatriculaService,
  ) {}

  async createEvaluacion(data: RegisterEvaluacionDto) {
    try {
      const {
        matricula,
        nota1,
        comentario1,
        nota2,
        comentario2,
        nota3,
        comentario3,
      } = data;

      // Obtengo los objetos matricula completos
      const matriculaCompleta =
        await this.getMatriculaService.getMatricula(matricula);
      console.log(matriculaCompleta);

      const evaluacion = new Evaluacion(
        0, // id
        matriculaCompleta,
        nota1,
        comentario1,
        nota2,
        comentario2,
        nota3,
        comentario3,
      );

      const evaluacionDb: Partial<EvaluacionDb> = {
        id: evaluacion.getId(),
        matricula: evaluacion.getMatricula(),
        nota1: evaluacion.getNota1(),
        comentario1: evaluacion.getComentario1(),
        nota2: evaluacion.getNota2(),
        comentario2: evaluacion.getComentario2(),
        nota3: evaluacion.getNota3(),
        comentario3: evaluacion.getComentario3(),
      };

      await this.evaluacionRepository.insert(evaluacionDb);

      return evaluacionDb;
    } catch (error) {
      console.error('Error al crear la evaluacion:', error);
      throw new Error('No se pudo crear la evaluacion');
    }
  }
}
