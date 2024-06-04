import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetActiveEvaluacionService } from './getActiveEvaluacion.service';

@Controller('activeEvaluacion')
export class GetActiveEvaluacionController {
  constructor(
    private readonly getActiveEvaluacionService: GetActiveEvaluacionService,
  ) {}

  @Get(':id')
  async getActiveEvaluacion(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const evaluacionActiva =
        await this.getActiveEvaluacionService.getActiveEvaluacion(Number(id));

      if (!evaluacionActiva) {
        return response
          .status(404)
          .json({ message: 'Línea para activar la evaluación no encontrada' });
      }

      return response.status(200).json(evaluacionActiva);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
