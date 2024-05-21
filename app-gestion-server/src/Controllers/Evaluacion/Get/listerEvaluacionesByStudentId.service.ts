import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerEvaluacionesByStudentIdService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  // OBTENER EVALUACIONES POR ID DE STUDENT
  async getEvaluacionesByStudentId(studentId: number): Promise<EvaluacionDb[]> {
    const listado = await this.evaluacionRepository.find({
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

    // const listado = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .innerJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .innerJoinAndSelect('matricula.student', 'student')
    //   .innerJoinAndSelect('matricula.subject', 'subject')
    //   .innerJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('student.id = :studentId', { studentId })
    //   .getMany();

    // const listado = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .leftJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .leftJoinAndSelect('matricula.student', 'student')
    //   .leftJoinAndSelect('matricula.subject', 'subject')
    //   .leftJoinAndSelect('matricula.teacher', 'teacher')
    //   .where('student.id = :studentId', { studentId })
    //   .getMany();

    console.log(listado);

    return listado;
  }
}
