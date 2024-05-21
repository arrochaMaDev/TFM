import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteEvaluacionesBysubjectIdService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // BORRAR EVALUACION POR ID DE SUBJECT
  async deleteEvaluacionesBySubjectId(
    subjectId: number,
  ): Promise<EvaluacionDb[]> {
    const evaluaciones = await this.evaluacionRepository.find({
      where: {
        matricula: { subject: { id: subjectId } },
      },
      relations: ['student', 'matricula.subject', 'matricula.teacher'],
    });

    // const evaluaciones = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .innerJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .innerJoinAndSelect('matricula.student', 'student')
    //   .innerJoinAndSelect('matricula.subject', 'subject')
    //   .innerJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('subject.id = :subjectId', { subjectId })
    //   .getMany();

    if (!evaluaciones) {
      throw new Error('Evaluaciones no encontradas');
    }
    console.log(evaluaciones);

    return await this.evaluacionRepository.remove(evaluaciones);
  }
}
