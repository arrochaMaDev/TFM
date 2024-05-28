import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetStudentService } from 'src/Controllers/Student/Get/getStudent.service';
import { ListerMatriculasByStudentIdService } from './listerMatriculasByStudentId.service';

@Controller('matriculas')
export class ListerMatriculasByStudentIdController {
  constructor(
    private readonly listerMatriculasByStudentIdService: ListerMatriculasByStudentIdService,
    private readonly getStudentService: GetStudentService,
  ) {}

  // OBTENER MATRICULAS POR ID DEL STUDENT
  @Get('student/:id')
  async getMatriculasByStudentId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const studentId = Number(id);
      const matriculas =
        await this.listerMatriculasByStudentIdService.getMatriculasByStudentId(
          studentId,
        );

      const student = await this.getStudentService.getStudent(studentId);
      if (!student) {
        return response
          .status(404)
          .json({ message: 'No se encuentra este estudiante' });
      }

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Matrículas no encontradas para este estudiante' });
      }

      // Controlo los datos mediante un DTO
      const matriculasDto = {
        student, // recibo primero los datos del estudiante y luego le añado el array de matriculas
        matriculas: matriculas.map(
          ({
            id,
            subject,
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
            subject: {
              id: subject.id,
              nombre: subject.nombre,
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
