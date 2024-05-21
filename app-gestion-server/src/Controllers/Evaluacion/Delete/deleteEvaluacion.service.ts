import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteEvaluacionService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // BORRAR EVALUACION POR ID DE MATRICULA
  async deleteEvaluacion(id: number): Promise<EvaluacionDb | null> {
    // se pone null para gestionar mejor si no se obtiene ninguna matricula, porque si no, devuelve undefined
    const evaluacion = await this.evaluacionRepository
      .createQueryBuilder('evaluacion')
      .leftJoinAndSelect('evaluacion.matricula', 'matricula')
      .leftJoinAndSelect('matricula.student', 'student')
      .leftJoinAndSelect('matricula.subject', 'subject')
      .leftJoinAndSelect('matricula.teacher', 'teacher')
      .where('evaluacion.id = :id', { id })
      .getOne();

    // const evaluacion = await this.evaluacionRepository.findOne({
    //   where: {
    //     id: id,
    //   },
    // });

    if (!evaluacion) {
      throw new Error('Evaluación no encontrada');
    }
    console.log(evaluacion);

    return await this.evaluacionRepository.remove(evaluacion);
  }
}
