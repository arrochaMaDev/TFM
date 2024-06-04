import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveEvaluacionDb } from 'src/Modelos/ActiveEvaluacion/activeEvaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteActiveEvaluacionService {
  constructor(
    @InjectRepository(ActiveEvaluacionDb)
    private readonly evaluacionActivaRepository: Repository<ActiveEvaluacionDb>,
  ) {}

  async deleteActiveEvaluacion(id: number): Promise<ActiveEvaluacionDb> {
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
