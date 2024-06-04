import { Controller, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdateActiveEvaluacionService } from './updateActiveEvaluacion.service';
import { ActiveEvaluacionDb } from 'src/Modelos/ActiveEvaluacion/activeEvaluacionDb';

@Controller('activeEvaluacion')
export class UpdateActiveEvaluacionController {
  constructor(
    private readonly updateActiveEvaluacionService: UpdateActiveEvaluacionService,
  ) {}

  @Put(':id')
  async uodateEvaluacionActiva(
    @Param('id') id: number,
    @Body() updatedData: Partial<ActiveEvaluacionDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedActiveEvaluacion =
        await this.updateActiveEvaluacionService.updateActiveEvaluacion(
          Number(id),
          updatedData,
        );
      return response.status(200).json(updatedActiveEvaluacion); // Devuelve la evaluación actualizada
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
