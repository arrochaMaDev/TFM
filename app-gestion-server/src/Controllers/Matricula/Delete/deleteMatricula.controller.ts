import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteMatriculaService } from './deleteMatricula.service';
import { DeleteStudentService } from 'src/Controllers/Student/Delete/deleteStudent.service';

@Controller('matricula')
export class DeleteMatriculaController {
  constructor(
    private readonly deleteMatriculaService: DeleteMatriculaService,
    private readonly deleteStudentService: DeleteStudentService,
  ) {}

  // BORRAR MATRICULA POR ID DE LA MATRICULA
  @Delete(':id')
  async deleteMatricula(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.deleteMatriculaService.deleteMatricula(Number(id));
      response.status(204).send();
      console.log('matricula eliminada con éxito');
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
    }
  }

  // BORRAR TODAS LAS MATRICULAS POR ID DEL STUDENT
  @Delete('student/:id')
  async deleteMatriculasByStudentId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const studentId = Number(id);
      const matriculas =
        await this.deleteMatriculaService.deleteMatriculasByStudentId(
          studentId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Matrículas no encontradas para este estudiante' });
      }

      return response.status(204).send('matriculas eliminadas con éxito');
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
  // BORRAR TODAS LAS MATRICULAS POR ID DEL PROFESOR
  @Delete('teacher/:id')
  async deleteMatriculasByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const teacherId = Number(id);
      const matriculas =
        await this.deleteMatriculaService.deleteMatriculasByTeacherId(
          teacherId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Matrículas no encontradas para este profesor' });
      }

      return response.status(204).send('matriculas eliminadas con éxito');
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }

  // BORRAR TODAS LAS MATRICULAS POR ID DE LA ASIGNATURA
  @Delete('subject/:id')
  async deleteMatriculasBySubjectId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const subjectId = Number(id);
      const matriculas =
        await this.deleteMatriculaService.deleteMatriculasBySubjectId(
          subjectId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Matrículas no encontradas para esta asignatura' });
      }

      return response.status(204).send('matriculas eliminadas con éxito');
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
