import { Controller, Delete, Param, Res } from '@nestjs/common';
import { DeleteSubjectService } from './deleteSubject.service';
import { Response } from 'express';

@Controller('asignaturas')
export class DeleteSubjectController {
  constructor(private readonly deleteSubjectService: DeleteSubjectService) {}

  @Delete(':id')
  async deleteSubject(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.deleteSubjectService.deleteSubject(Number(id));
      response.status(204).send(); // Asignatura eliminada con éxito
      console.log('Asignarura eliminada');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
