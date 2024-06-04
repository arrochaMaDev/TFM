import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveEvaluacionDb } from 'src/Modelos/ActiveEvaluacion/activeEvaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateActiveEvaluacionService {
  constructor(
    @InjectRepository(ActiveEvaluacionDb)
    private readonly evaluacionActivaRepository: Repository<ActiveEvaluacionDb>,
  ) {}

  async updateActiveEvaluacion(
    id: number,
    newData: Partial<ActiveEvaluacionDb>,
  ): Promise<ActiveEvaluacionDb> {
    const evaluacionActivaToUpdate =
      await this.evaluacionActivaRepository.findOne({
        where: { id },
      });

    if (!evaluacionActivaToUpdate) {
      throw new Error('Línea para activar la evaluación no encontrada');
    }

    // Opción con merge
    const evaluacionActivaUpdated = this.evaluacionActivaRepository.merge(
      evaluacionActivaToUpdate,
      newData,
    );

    // Guarda los cambios en la base de datos
    await this.evaluacionActivaRepository.save(evaluacionActivaUpdated);

    return evaluacionActivaUpdated;
  }
}
