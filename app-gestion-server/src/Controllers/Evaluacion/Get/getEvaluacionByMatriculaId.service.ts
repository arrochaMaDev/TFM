import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetEvaluacionByMatriculaIdService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // OBTENER EVALUACIONES POR ID DE MATRICULA
  async getEvaluacionByMatriculaId(matriculaId: number): Promise<EvaluacionDb> {
    const evaluacion = await this.evaluacionRepository.findOne({
      where: {
        matricula: { id: matriculaId },
      },
      relations: [
        'matricula',
        'matricula.student',
        'matricula.subject',
        'matricula.teacher',
      ],
    });

    // const listado = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .innerJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .innerJoinAndSelect('matricula.student', 'student')
    //   .innerJoinAndSelect('matricula.subject', 'subject')
    //   .innerJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('matricula.id = :matriculaId', { matriculaId })
    //   .getMany();

    // const listado = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .leftJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .leftJoinAndSelect('matricula.student', 'student')
    //   .leftJoinAndSelect('matricula.subject', 'subject')
    //   .leftJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('matricula.id = :matriculaId', { matriculaId })
    //   .getMany();

    console.log(evaluacion);

    return evaluacion || null;
  }
}
