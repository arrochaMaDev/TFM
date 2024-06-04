import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionActivaDb } from 'src/Modelos/EvaluacionActiva/evaluacionActivaDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetEvaluacionActivaService {
  constructor(
    @InjectRepository(EvaluacionActivaDb)
    private readonly evaluacionActivaRepository: Repository<EvaluacionActivaDb>,
  ) {}

  async getEvaluacionActiva(id: number): Promise<EvaluacionActivaDb> {
    const evaluacionActiva = await this.evaluacionActivaRepository.findOne({
      where: {
        id,
      },
    });
    console.log(evaluacionActiva);
    return evaluacionActiva;
  }
}
