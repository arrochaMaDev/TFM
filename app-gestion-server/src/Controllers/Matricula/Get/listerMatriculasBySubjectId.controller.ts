import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetSubjectService } from 'src/Controllers/Subject/Get/getSubject.service';
import { ListerMatriculasBySubjectIdService } from './listerMatriculasBySubjectId.service';

@Controller('matriculas')
export class ListerMatriculasBySubjectIdController {
  constructor(
    private readonly getMatriculasBySubjectIdService: ListerMatriculasBySubjectIdService,
    private readonly getSubjectService: GetSubjectService,
  ) {}

  // OBTENER MATRICULA POR ID DEL PROFESOR
  @Get('subject/:id')
  async getMatriculasByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const subjectId = Number(id);

      const subject = await this.getSubjectService.getSubject(subjectId);
      if (!subject) {
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const matriculas =
        await this.getMatriculasBySubjectIdService.getMatriculasBySubjectId(
          subjectId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Evaluaciones no encontradas para este profesor' });
      }

      // Controlo los datos mediante un DTO
      const matriculasDto = {
        subject, // recibo primero los datos de la asignatura y luego le añado el array de matriculas
        matriculas: matriculas.map(
          ({
            id,
            student,
            teacher,
            year,
            nota1,
            comentario1,
            nota2,
            comentario2,
            nota3,
            comentario3,
          }) => ({
            id,
            student: {
              id: student.id,
              nombre: student.nombre,
              apellidos: student.apellidos,
              dni: student.dni,
              direccion: student.direccion,
              telefono: student.telefono,
              email: student.email,
            },
            teacher: {
              id: teacher.id,
              nombre: teacher.nombre,
              apellidos: teacher.apellidos,
              dni: teacher.dni,
              direccion: teacher.direccion,
              telefono: teacher.telefono,
              email: teacher.email,
            },
            year,
            nota1,
            comentario1,
            nota2,
            comentario2,
            nota3,
            comentario3,
          }),
        ),
      };
      return response.status(200).json(matriculasDto);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
