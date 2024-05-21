import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteEvaluacionesByTeacherIdService } from './deleteEvaluacionesByTeacherId.service';
import { GetTeacherService } from 'src/Controllers/Teacher/Get/getTeacher.service';

@Controller('evaluaciones')
export class DeleteEvaluacionesByTeacherIdController {
  constructor(
    private readonly deleteEvaluacionesByTeacherIdService: DeleteEvaluacionesByTeacherIdService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  // BORRAR EVALUACION POR ID DE TEACHER
  @Delete('teacher/:id')
  async deleteEvaluacionesByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const teacherId = Number(id);

      const teacher = await this.getTeacherService.getTeacher(teacherId);
      if (!teacher) {
        // throw new NotFoundException('No se encuentra este estudiante');
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const evaluaciones =
        await this.deleteEvaluacionesByTeacherIdService.deleteEvaluacionesByTeacherId(
          teacherId,
        );

      if (!evaluaciones || evaluaciones.length === 0) {
        return response.status(404).json({
          message: 'Evaluaciones no encontradas para este profesor',
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
