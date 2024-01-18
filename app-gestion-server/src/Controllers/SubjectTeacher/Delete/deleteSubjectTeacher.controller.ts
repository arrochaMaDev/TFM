import { Controller, Delete, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteSubjectTeacherService } from './deleteSubjectTeacher.service';

@Controller('asignatura_profesor')
export class DeleteSubjectTeacherController {
  constructor(
    private readonly deleteSubjectTeacherService: DeleteSubjectTeacherService,
  ) {}

  // BORRAR RELACIONES ASIGNATURA-PROFESOR POR ID
  @Delete(':id')
  async deleteSubjectTeacher(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      await this.deleteSubjectTeacherService.deleteSubjectTeacher(Number(id));
      response.status(HttpStatus.OK).send();
      console.log('relación eliminada con éxito');
    } catch (error) {
      console.error(error);
      response.status(400).json({ error: error.message });
    }
  }
}
