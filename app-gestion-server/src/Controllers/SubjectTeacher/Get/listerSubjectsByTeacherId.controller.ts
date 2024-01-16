import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetTeacherService } from 'src/Controllers/Teacher/Get/getTeacher.service';
import { ListerSubjectsByTeacherIdService } from './listerSubjectsByTeacherId.service';

@Controller('asignaturas_profesores')
export class ListerSubjectsByTeacherIdController {
  constructor(
    private readonly getSubjectsByTeacherIdService: ListerSubjectsByTeacherIdService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  // OBTENER MATRICULA POR ID DEL STUDENT
  @Get('teacher/:id')
  async getSubjectsByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const teacherId = Number(id);
      const subjects =
        await this.getSubjectsByTeacherIdService.getSubjectsByTeacherId(
          teacherId,
        );

      if (!subjects || subjects.length === 0) {
        return response
          .status(404)
          .json({ message: 'Asignaturas no encontradas para este profesor' });
      }
      // Controlo los datos mediante un DTO
      const teacher = await this.getTeacherService.getTeacher(teacherId);
      if (!teacher) {
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const subjectsDto = {
        profesor: teacher, // recibo primero los datos del profesor y luego le añado el array de asignaturas
        asignaturas: subjects.map(({ id, subject }) => ({
          id,
          subject: {
            id: subject.id,
            nombre: subject.nombre,
          },
        })),
      };
      return response.status(200).json(subjectsDto);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
