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
      response.status(204).send(); // Usuario eliminado con éxito
      console.log('eliminado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}

// async deleteUser(request: Request, response: Response): Promise<void> {
//   try {
//     const { id, username, email } = request.params;
//     await this.userService.deleteUser(Number(id), username, email);
//     response.status(204).send(); // Usuario eliminado con éxito
//   } catch (error) {
//     response.status(400).json({ error: error.message });
//   }
// }
