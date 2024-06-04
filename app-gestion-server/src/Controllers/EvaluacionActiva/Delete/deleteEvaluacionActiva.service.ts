import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionActivaDb } from 'src/Modelos/EvaluacionActiva/evaluacionActivaDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteEvaluacionActivaService {
  constructor(
    @InjectRepository(EvaluacionActivaDb)
    private readonly evaluacionActivaRepository: Repository<EvaluacionActivaDb>,
  ) {}

  async deleteEvaluacionActiva(id: number): Promise<EvaluacionActivaDb> {
    const evaluacionActiva = await this.evaluacionActivaRepository.findOne({
      where: {
        id,
      },
    });

    if (!evaluacionActiva) {
      throw new Error('Línea para activar la evaluación no encontrada');
    }

    console.log(evaluacionActiva);
    return await this.evaluacionActivaRepository.remove(evaluacionActiva);
  }
}
