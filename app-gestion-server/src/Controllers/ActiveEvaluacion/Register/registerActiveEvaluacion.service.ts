import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveEvaluacionDb } from 'src/Modelos/ActiveEvaluacion/activeEvaluacionDb';
import { Repository } from 'typeorm';
import { RegisterActiveEvaluacionDto } from './registerActiveEvaluacion.dto';
import { ActiveEvaluacion } from 'src/Modelos/ActiveEvaluacion/activeEvaluacion';

@Injectable()
export class RegisterActiveEvaluacionService {
  constructor(
    @InjectRepository(ActiveEvaluacionDb)
    private readonly evaluacionActivaRepository: Repository<ActiveEvaluacionDb>,
  ) {}

  async createActiveEvaluacion(data: RegisterActiveEvaluacionDto) {
    try {
      const { activeEval1, activeEval2, activeEval3 } = data;

      const evaluacionActiva = new ActiveEvaluacion(
        0,
        activeEval1,
        activeEval2,
        activeEval3,
      );

      console.log(evaluacionActiva);

      const evaluacionActivaDb: ActiveEvaluacionDb = {
        id: evaluacionActiva.getId(),
        activeEval1: evaluacionActiva.getactiveEval1(),
        activeEval2: evaluacionActiva.getactiveEval2(),
        activeEval3: evaluacionActiva.getactiveEval3(),
      };
      console.log(evaluacionActivaDb);

      await this.evaluacionActivaRepository.insert(evaluacionActivaDb);
      return evaluacionActivaDb;
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
      throw new Error('No se pudo crear la línea para activar la evaluación');
    }
  }
}
