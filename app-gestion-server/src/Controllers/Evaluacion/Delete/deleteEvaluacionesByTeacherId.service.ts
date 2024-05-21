import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteEvaluacionesByTeacherIdService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // BORRAR EVALUACION POR ID DE TEACHER
  async deleteEvaluacionesByTeacherId(
    teacherId: number,
  ): Promise<EvaluacionDb[]> {
    const evaluaciones = await this.evaluacionRepository.find({
      where: {
        matricula: { teacher: { id: teacherId } },
      },
      relations: ['student', 'matricula.subject', 'matricula.teacher'],
    });

    // const evaluaciones = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .innerJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .innerJoinAndSelect('matricula.student', 'student')
    //   .innerJoinAndSelect('matricula.subject', 'subject')
    //   .innerJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('teacher.id = :teacherId', { teacherId })
    //   .getMany();

    if (!evaluaciones) {
      throw new Error('Evaluaciones no encontradas');
    }
    console.log(evaluaciones);

    return await this.evaluacionRepository.remove(evaluaciones);
  }
}
