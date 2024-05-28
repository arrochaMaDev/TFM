import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ListerMatriculasByTeacherIdService } from './listerMatriculasByTeacherId.service';
import { GetTeacherService } from 'src/Controllers/Teacher/Get/getTeacher.service';

@Controller('matriculas')
export class ListerMatriculasByTeacherIdController {
  constructor(
    private readonly getMatriculasByTeacherIdService: ListerMatriculasByTeacherIdService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  // OBTENER MATRICULA POR ID DEL PROFESOR
  @Get('teacher/:id')
  async getMatriculasByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const teacherId = Number(id);

      const teacher = await this.getTeacherService.getTeacher(teacherId);
      if (!teacher) {
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const matriculas =
        await this.getMatriculasByTeacherIdService.getMatriculasByTeacherId(
          teacherId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Evaluaciones no encontradas para este profesor' });
      }

      // Controlo los datos mediante un DTO
      const matriculasDto = {
        teacher, // recibo primero los datos del profesor y luego le añado el array de matriculas
        matriculas: matriculas.map(
          ({
            id,
            student,
            subject,
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
            subject: {
              id: subject.id,
              nombre: subject.nombre,
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
