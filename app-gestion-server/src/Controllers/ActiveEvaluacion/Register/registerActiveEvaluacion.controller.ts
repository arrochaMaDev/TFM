import { Body, Controller, Post } from '@nestjs/common';
import { RegisterActiveEvaluacionDto } from './registerActiveEvaluacion.dto';
import { RegisterActiveEvaluacionService } from './registerActiveEvaluacion.service';

@Controller('activeEvaluacion')
export class RegisterActiveEvaluacionController {
  constructor(
    private readonly registerActiveEvaluacionService: RegisterActiveEvaluacionService,
  ) {}

  @Post()
  async registerActiveEvaluacion(@Body() data: RegisterActiveEvaluacionDto) {
    try {
      // const { evaluacion1, evaluacion2, evaluacion3 } = data;

      const evaluacionActiva =
        await this.registerActiveEvaluacionService.createActiveEvaluacion(data);

      return evaluacionActiva;
    } catch (error) {
      console.error('Error al crear el estudiante:', error);
      throw new Error('No se pudo crear la línea para activar la evaluación');
    }
  }
}
