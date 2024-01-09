import { Controller, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { UpdateSubjectService } from './updateSubject.service';

@Controller('asignatura')
export class UpdateSubjectController {
  constructor(private readonly updateSubjectService: UpdateSubjectService) {}

  @Put(':id')
  async updateSubject(
    @Param('id') id: number,
    @Body() updatedData: Partial<SubjectDb>,
    @Res() response: Response,
  ) {
    try {
      const updatedSubject = await this.updateSubjectService.updateSubject(
        Number(id),
        updatedData,
      );
      response.status(200).json(updatedSubject); // Devuelve la asignatura actualizada
      console.log('Actualizado con éxito');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
}
