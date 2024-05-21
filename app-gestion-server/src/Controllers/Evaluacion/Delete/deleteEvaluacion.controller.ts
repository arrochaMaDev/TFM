import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteStudentService } from 'src/Controllers/Student/Delete/deleteStudent.service';
import { DeleteEvaluacionService } from './deleteEvaluacion.service';

@Controller('evaluacion')
export class DeleteEvaluacionController {
  constructor(
    private readonly deleteEvaluacionService: DeleteEvaluacionService,
    private readonly deleteStudentService: DeleteStudentService,
  ) {}

  // BORRAR MATRICULA POR ID DE LA MATRICULA
  @Delete(':id')
  async deleteEvaluacion(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.deleteEvaluacionService.deleteEvaluacion(Number(id));
      response.status(204).send();
      console.log('Evaluación eliminada con éxito');
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
    }
  }
}
