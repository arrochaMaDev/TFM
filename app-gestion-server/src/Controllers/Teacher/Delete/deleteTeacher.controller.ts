import { Controller, Delete, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DeleteTeacherService } from './deleteTeacher.service';

@Controller('teacher')
export class DeleteTeacherController {
  constructor(private readonly deleteTeacherService: DeleteTeacherService) {}

  @Delete(':id')
  async deleteTeacher(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.deleteTeacherService.deleteTeacher(Number(id));
      response.status(204).send(); // Profesor eliminado con éxito
      console.log('Profesor eliminado');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
