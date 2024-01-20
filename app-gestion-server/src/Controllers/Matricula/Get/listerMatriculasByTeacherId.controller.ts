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
      const matriculas =
        await this.getMatriculasByTeacherIdService.getMatriculasByTeacherId(
          teacherId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Matrículas no encontradas para este profesor' });
      }
      // Controlo los datos mediante un DTO
      const teacher = await this.getTeacherService.getTeacher(teacherId);
      if (!teacher) {
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const matriculasDto = {
        teacher, // recibo primero los datos del estudiante y luego le añado el array de matriculas
        matriculas: matriculas.map(({ id, student, subject, year }) => ({
          id,
          student: {
            id: student.id,
            nombre: student.nombre,
            apellidos: student.apellidos,
            dni: student.dni,
            email: student.email,
            direccion: student.direccion,
            telefono: student.telefono,
          },
          subject: {
            id: subject.id,
            nombre: subject.nombre,
          },
          year,
        })),
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
