import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionActivaDb } from 'src/Modelos/EvaluacionActiva/evaluacionActivaDb';
import { Repository } from 'typeorm';
import { RegisterEvaluacionActivaDto } from './registerEvaluacionActiva.dto';
import { EvaluacionActiva } from 'src/Modelos/EvaluacionActiva/evaluacionActiva';

@Injectable()
export class RegisterEvaluacionActivaService {
  constructor(
    @InjectRepository(EvaluacionActivaDb)
    private readonly evaluacionActivaRepository: Repository<EvaluacionActivaDb>,
  ) {}

  async createEvaluacionActiva(data: RegisterEvaluacionActivaDto) {
    try {
      const { evaluacion1, evaluacion2, evaluacion3 } = data;

      const evaluacionActiva = new EvaluacionActiva(
        0,
        evaluacion1,
        evaluacion2,
        evaluacion3,
      );

      console.log(evaluacionActiva);

      const evaluacionActivaDb: EvaluacionActivaDb = {
        id: evaluacionActiva.getId(),
        evaluacion1: evaluacionActiva.getEvaluacion1(),
        evaluacion2: evaluacionActiva.getEvaluacion2(),
        evaluacion3: evaluacionActiva.getEvaluacion3(),
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
