import { Controller, Delete, Param, Res } from '@nestjs/common';
import { DeleteStudentService } from './deleteStudent.service';
import { Response } from 'express';

@Controller('student')
export class DeleteStudentController {
  constructor(private readonly deleteStudentService: DeleteStudentService) {}

  @Delete(':id')
  async deleteStudent(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.deleteStudentService.deleteStudent(Number(id));
      response.status(204).send();
      console.log('eliminado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
