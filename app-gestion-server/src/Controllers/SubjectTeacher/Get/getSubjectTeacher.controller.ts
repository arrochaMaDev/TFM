import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetSubjectTeacherService } from './getSubjectTeacher.service';

@Controller('asignatura_profesor')
export class GetSubjectteacherController {
  constructor(
    private readonly getSubjectTeacherService: GetSubjectTeacherService,
  ) {}

  // OBTENER MATRICULA POR ID DE LA MATRICULA
  @Get(':id')
  async getSubjectTeacher(@Param('id') id: number, @Res() response: Response) {
    try {
      const subjectTeacher =
        await this.getSubjectTeacherService.getSubjectTeacher(Number(id));

      if (!subjectTeacher) {
        return response.status(404).json({ message: 'Relación no encontrada' });
      }
      // CONTROLAR LOS DATOS MEDIANTE UN DTO
      const subjectTeacherDto = {
        id: subjectTeacher.id,
        subject: {
          id: subjectTeacher.subject.id,
          nombre: subjectTeacher.subject.nombre,
        },
        teacher: {
          id: subjectTeacher.teacher.id,
          nombre: subjectTeacher.teacher.nombre,
          apellidos: subjectTeacher.teacher.apellidos,
          email: subjectTeacher.teacher.email,
        },
      };
      return response.status(200).json(subjectTeacherDto);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
