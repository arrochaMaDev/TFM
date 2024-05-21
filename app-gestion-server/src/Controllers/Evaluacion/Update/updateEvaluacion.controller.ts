import { Body, Controller, Param, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdateEvaluacionService } from './updateEvaluacion.service';
import { EvaluacionDb } from 'src/Modelos/Evaluacion/evaluacionDb';

@Controller('evaluacion')
export class UpdateEvaluacionController {
  constructor(
    private readonly updateEvaluacionService: UpdateEvaluacionService,
  ) {}

  @Put(':id')
  async updateEvaluacion(
    @Param('id') id: number,
    @Body() updatedData: Partial<EvaluacionDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedEvaluacion =
        await this.updateEvaluacionService.updateEvaluacion(
          Number(id),
          updatedData,
        );

      console.log('Actualizada con éxito');

      return response.status(200).json(updatedEvaluacion);
    } catch (error) {}
  }
}
