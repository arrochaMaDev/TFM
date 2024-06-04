import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteActiveEvaluacionService } from './deleteActiveEvaluacion.service';

@Controller('activeEvaluacion')
export class DeleteActiveEvaluacionController {
  constructor(
    private readonly getActiveEvaluacionService: DeleteActiveEvaluacionService,
  ) {}

  @Delete(':id')
  async deleteActiveEvaluacion(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const evaluacionActiva =
        await this.getActiveEvaluacionService.deleteActiveEvaluacion(
          Number(id),
        );

      if (!evaluacionActiva) {
        return response
          .status(404)
          .json({ message: 'Línea para activar la evaluación no encontrada' });
      }

      response.status(204).send();
      console.log('eliminado con éxito');
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
