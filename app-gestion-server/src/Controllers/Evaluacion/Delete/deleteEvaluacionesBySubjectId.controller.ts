import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetSubjectService } from 'src/Controllers/Subject/Get/getSubject.service';
import { DeleteEvaluacionesBysubjectIdService } from './deleteEvaluacionesBySubjectId.service';

@Controller('evaluaciones')
export class DeleteEvaluacionesBySubjectIdController {
  constructor(
    private readonly deleteEvaluacionesBySubjectIdService: DeleteEvaluacionesBysubjectIdService,
    private readonly getSubjectService: GetSubjectService,
  ) {}

  // BORRAR EVALUACION POR ID DE SUBJECT
  @Delete('subject/:id')
  async deleteEvaluacionesBySubjectId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const subjectId = Number(id);

      const subject = await this.getSubjectService.getSubject(subjectId);
      if (!subject) {
        // throw new NotFoundException('No se encuentra este estudiante');
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const evaluaciones =
        await this.deleteEvaluacionesBySubjectIdService.deleteEvaluacionesBySubjectId(
          subjectId,
        );

      if (!evaluaciones || evaluaciones.length === 0) {
        return response.status(404).json({
          message: 'Evaluaciones no encontradas para esta asignatura',
        });
      }

      return response.status(204).send('Evaluaciones eliminadas con éxito');
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
