import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveEvaluacionDb } from 'src/Modelos/ActiveEvaluacion/activeEvaluacionDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetActiveEvaluacionService {
  constructor(
    @InjectRepository(ActiveEvaluacionDb)
    private readonly evaluacionActivaRepository: Repository<ActiveEvaluacionDb>,
  ) {}

  async getActiveEvaluacion(id: number): Promise<ActiveEvaluacionDb> {
    const evaluacionActiva = await this.evaluacionActivaRepository.findOne({
      where: {
        id,
      },
    });
    console.log(evaluacionActiva);
    return evaluacionActiva;
  }
}
