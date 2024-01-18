import { Controller, Delete, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteSubjectTeacherBySubjectIdService } from './deleteSubjectTeacherBySubjectId.service';

@Controller('asignaturas_profesores')
export class DeleteSubjectTeacherBySubjectIdController {
  constructor(
    private readonly deleteSubjectTeacherService: DeleteSubjectTeacherBySubjectIdService,
  ) {}

  // BORRAR RELACIONES POR ID DE LA ASIGNATURA
  @Delete('subject/:id')
  async deleteSubjectTeacherBySubjectId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const subjectId = Number(id);
      const subjectsTeachers =
        await this.deleteSubjectTeacherService.deleteSubjectTeacherBySubjectId(
          subjectId,
        );

      if (!subjectsTeachers || subjectsTeachers.length === 0) {
        return response
          .status(404)
          .json({ message: 'Relaciones no encontradas para esta asignatura' });
      }

      return response
        .status(HttpStatus.OK)
        .send('relaciones eliminadas con éxito');
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
