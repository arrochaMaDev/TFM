import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerEvaluacionesBySubjectIdService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // OBTENER EVALUACIONES POR ID DE STUDENT
  async getEvaluacionesBySubjectId(subjectId: number): Promise<EvaluacionDb[]> {
    const listado = await this.evaluacionRepository.find({
      where: {
        matricula: { subject: { id: subjectId } },
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
    //   .where('subject.id = :subjectId', { subjectId })
    //   .getMany();

    // const listado = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .leftJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .leftJoinAndSelect('matricula.student', 'student')
    //   .leftJoinAndSelect('matricula.subject', 'subject')
    //   .leftJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('subject.id = :subjectId', { subjectId })
    //   .getMany();

    console.log(listado);

    return listado;
  }
}
