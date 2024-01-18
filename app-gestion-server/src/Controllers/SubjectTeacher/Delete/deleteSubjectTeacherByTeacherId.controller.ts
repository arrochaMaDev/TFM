import { Controller, Delete, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteSubjectTeacherByTeacherIdService } from './deleteSubjectTeacherByTeacherId.service';

@Controller('asignaturas_profesores')
export class DeleteSubjectTeacherByTeacherIdController {
  constructor(
    private readonly deleteSubjectTeacherService: DeleteSubjectTeacherByTeacherIdService,
  ) {}

  // BORRAR RELACIONES POR ID DEL PROFESOR
  @Delete('teacher/:id')
  async deleteSubjectTeacherByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const teacherId = Number(id);
      const subjectsTeachers =
        await this.deleteSubjectTeacherService.deleteSubjectTeacherByTeacherId(
          teacherId,
        );

      if (!subjectsTeachers || subjectsTeachers.length === 0) {
        return response
          .status(404)
          .json({ message: 'Relaciones no encontradas para este profesor' });
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
