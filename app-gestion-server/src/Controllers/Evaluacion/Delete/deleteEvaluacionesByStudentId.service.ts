import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteEvaluacionesByStudentIdService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // BORRAR EVALUACIONES POR ID DE STUDENT
  async deleteEvaluacionesByStudentId(
    studentId: number,
  ): Promise<EvaluacionDb[]> {
    const evaluaciones = await this.evaluacionRepository.find({
      where: {
        matricula: { student: { id: studentId } },
      },
      relations: [
        'matricula',
        'matricula.student',
        'matricula.subject',
        'matricula.teacher',
      ],
    });

    // const evaluaciones = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .innerJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .innerJoinAndSelect('matricula.student', 'student')
    //   .innerJoinAndSelect('matricula.subject', 'subject')
    //   .innerJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('student.id = :studentId', { studentId })
    //   .getMany();

    // const evaluaciones = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .leftJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .leftJoinAndSelect('matricula.student', 'student')
    //   .leftJoinAndSelect('matricula.subject', 'subject')
    //   .leftJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('student.id = :studentId', { studentId })
    //   .getMany();

    console.log(evaluaciones);

    return await this.evaluacionRepository.remove(evaluaciones);
  }
}
