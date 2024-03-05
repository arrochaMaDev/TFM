import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ListerTeachersBySubjectIdService } from './listerTeachersBySubjectId.service';
import { GetSubjectService } from 'src/Controllers/Subject/Get/getSubject.service';

@Controller('asignaturas_profesores')
export class ListerTeachersBySubjectIdController {
  constructor(
    private readonly getTeachersBySubjectIdService: ListerTeachersBySubjectIdService,
    private readonly getSubjectService: GetSubjectService,
  ) {}

  // OBTENER MATRICULA POR ID DEL STUDENT
  @Get('subject/:id')
  async getTeachersBySubjectId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const subjectId = Number(id);
      const teachers =
        await this.getTeachersBySubjectIdService.getTeachersBySubjectId(
          subjectId,
        );

      if (!teachers || teachers.length === 0) {
        return response
          .status(404)
          .json({ message: 'Profesores no encontrados para esta asignatura' });
      }
      // Controlo los datos mediante un DTO
      const subject = await this.getSubjectService.getSubject(subjectId);
      if (!subject) {
        return response
          .status(404)
          .json({ message: 'No se encuentra esta asignatura' });
      }

      const teachersDto = {
        subject: subject, // recibo primero los datos de la asignatura y luego le añado el array de profesores
        teachers: teachers.map(({ id, teacher }) => ({
          id,
          teacher: {
            id: teacher.id,
            nombre: teacher.nombre,
            apellidos: teacher.apellidos,
          },
        })),
      };
      return response.status(200).json(teachersDto);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
