import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerEvaluacionesService {
  constructor(
    @InjectRepository(EvaluacionDb)
    private readonly evaluacionRepository: Repository<EvaluacionDb>,
  ) {}

  async listerEvaluaciones(): Promise<EvaluacionDb[]> {
    const listado = await this.evaluacionRepository.find({
      relations: [
        'matricula',
        'matricula.student',
        'matricula.subject',
        'matricula.teacher',
      ],
    });

    // const listado = await this.evaluacionRepository
    //   .createQueryBuilder('evaluacion')
    //   .leftJoinAndSelect('evaluacion.matricula', 'matricula')
    //   .leftJoinAndSelect('matricula.student', 'student')
    //   .leftJoinAndSelect('matricula.teacher', 'teacher')
    //   .leftJoinAndSelect('matricula.subject', 'subject')
    //   .getMany();
    console.table(listado);

    return listado;
  }
}
