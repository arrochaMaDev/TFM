import { Controller, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdateEvaluacionActivaService } from './updateEvaluacionActiva.service';
import { EvaluacionActivaDb } from 'src/Modelos/EvaluacionActiva/evaluacionActivaDb';

@Controller('evaluacionActiva')
export class UpdateEvaluacionActivaController {
  constructor(
    private readonly updateEvaluacionActivaService: UpdateEvaluacionActivaService,
  ) {}

  @Put(':id')
  async uodateEvaluacionActiva(
    @Param('id') id: number,
    @Body() updatedData: Partial<EvaluacionActivaDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedEvaluacionActiva =
        await this.updateEvaluacionActivaService.updateEvaluacionActiva(
          Number(id),
          updatedData,
        );
      return response.status(200).json(updatedEvaluacionActiva); // Devuelve la evaluación actualizada
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
