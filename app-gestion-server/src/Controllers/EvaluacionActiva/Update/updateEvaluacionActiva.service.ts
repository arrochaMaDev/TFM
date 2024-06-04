import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionActivaDb } from 'src/Modelos/EvaluacionActiva/evaluacionActivaDb';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateEvaluacionActivaService {
  constructor(
    @InjectRepository(EvaluacionActivaDb)
    private readonly evaluacionActivaRepository: Repository<EvaluacionActivaDb>,
  ) {}

  async updateEvaluacionActiva(
    id: number,
    newData: Partial<EvaluacionActivaDb>,
  ): Promise<EvaluacionActivaDb> {
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
