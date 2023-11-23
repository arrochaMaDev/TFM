import { Controller, Put, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { UpdateStudentService } from './UpdateStudent.service';

@Controller('student')
export class UpdateStudentController {
  constructor(private readonly updateStudentService: UpdateStudentService) {}

  @Put(':id')
  async updateStudent(
    @Param('id') id: number,
    @Body() updatedData: Partial<StudentDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedStudent = await this.updateStudentService.updateStudent(
        Number(id),
        updatedData,
      );
      response.status(200).json(updatedStudent); // Devuelve el estudiante actualizado
      console.log('Actualizado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
