import { Controller, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdateTeacherService } from './updateTeacher.service';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';

@Controller('matricula')
export class UpdateMatriculaController {
  constructor(private readonly updateTeacherService: UpdateTeacherService) {}

  @Put(':id')
  async updateTeacher(
    @Param('id') id: number,
    @Body() updatedData: Partial<TeacherDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedTeacher = await this.updateTeacherService.updateTeacher(
        Number(id),
        updatedData,
      );
      response.status(200).json(updatedTeacher); // Devuelve el profesor actualizado
      console.log('Actualizado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
