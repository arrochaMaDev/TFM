import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionActivaDb } from 'src/Modelos/EvaluacionActiva/evaluacionActivaDb';
import { Repository } from 'typeorm';
import { RegisterEvaluacionActivaDto } from './registerEvaluacionActiva.dto';
import { EvaluacionActiva } from 'src/Modelos/EvaluacionActiva/evaluacionActiva';
import { RegisterEvaluacionActivaService } from './registerEvaluacionActiva.service';

@Controller('evaluacionActiva')
export class RegisterEvaluacionActivaController {
  constructor(
    private readonly registerEvaluacionActivaService: RegisterEvaluacionActivaService,
  ) {}

  @Post()
  async registerEvaluacionActiva(@Body() data: RegisterEvaluacionActivaDto) {
    try {
      // const { evaluacion1, evaluacion2, evaluacion3 } = data;

      const evaluacionActiva =
        await this.registerEvaluacionActivaService.createEvaluacionActiva(data);

      return evaluacionActiva;
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
      throw new Error('No se pudo crear la línea para activar la evaluación');
    }
  }
}
