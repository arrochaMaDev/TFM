import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetEvaluacionActivaService } from './getEvaluacionActiva.service';

@Controller('evaluacionActiva')
export class GetEvaluacionActivaController {
  constructor(
    private readonly getEvaluacionActivaService: GetEvaluacionActivaService,
  ) {}

  @Get(':id')
  async getEvaluacionActiva(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const evaluacionActiva =
        await this.getEvaluacionActivaService.getEvaluacionActiva(Number(id));

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
