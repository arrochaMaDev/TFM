import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

export class GetEvaluacionService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // OBTENER EVALUACIONES POR ID DE EVALUACION
  async getEvaluacion(id: number): Promise<EvaluacionDb | null> {
    const evaluacion = await this.evaluacionRepository
      .createQueryBuilder('evaluacion')
      .leftJoinAndSelect('evaluacion.matricula', 'matricula')
      .leftJoinAndSelect('matricula.student', 'student')
      .leftJoinAndSelect('matricula.teacher', 'teacher')
      .leftJoinAndSelect('matricula.subject', 'subject')
      .where('evaluacion.id = :id', { id })
      .getOne();

    // const evaluacion = await this.evaluacionRepository.findOne({
    //   where: {
    //     id: id,
    //   },
    // });
    return evaluacion || null;
  }
}
