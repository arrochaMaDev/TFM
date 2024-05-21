import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetStudentService } from 'src/Controllers/Student/Get/getStudent.service';
import { DeleteEvaluacionesByStudentIdService } from './deleteEvaluacionesByStudentId.service';

@Controller('evaluaciones')
export class DeleteEvaluacionesByStudentIdController {
  constructor(
    private readonly deleteEvaluacionesByStudentIdService: DeleteEvaluacionesByStudentIdService,
    private readonly getStudentService: GetStudentService,
  ) {}

  // BORRAR EVALUACIONES POR ID DE STUDENT
  @Delete('student/:id')
  async deleteEvaluacionesByStudentId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const studentId = Number(id);

      const student = await this.getStudentService.getStudent(studentId);
      if (!student) {
        // throw new NotFoundException('No se encuentra este estudiante');
        return response
          .status(404)
          .json({ message: 'No se encuentra este estudiante' });
      }

      const evaluaciones =
        await this.deleteEvaluacionesByStudentIdService.deleteEvaluacionesByStudentId(
          studentId,
        );

      if (!evaluaciones || evaluaciones.length === 0) {
        // throw new NotFoundException(
        //   'Evaluaciones no encontradas para este estudiante',
        // );
        return response.status(404).json({
          message: 'Evaluaciones no encontradas para este estudiante',
        });
      }

      return response.status(204).send('Evaluaciones eliminadas con éxito');
    } catch (error) {
      // throw new Error('Error interno del servidor');
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
