import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetMatriculaService } from './getMatricula.service';
import { GetStudentService } from 'src/Controllers/Student/Get/getStudent.service';
import { GetMatriculasByStudentIdService } from './listerMatriculasByStudentId.service';

@Controller('matriculas')
export class GetMatriculasByStudentIdController {
  constructor(
    private readonly getMatriculasByStudentIdService: GetMatriculasByStudentIdService,
    private readonly getStudentService: GetStudentService,
  ) {}

  // OBTENER MATRICULA POR ID DEL STUDENT
  @Get('student/:id')
  async getMatriculasByStudentId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const studentId = Number(id);
      const matriculas =
        await this.getMatriculasByStudentIdService.getMatriculasByStudentId(
          studentId,
        );

      if (!matriculas || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'Matrículas no encontradas para este estudiante' });
      }
      // Controlo los datos mediante un DTO
      const student = await this.getStudentService.getStudent(studentId);
      if (!student || matriculas.length === 0) {
        return response
          .status(404)
          .json({ message: 'No se encuentra este estudiante' });
      }

      const matriculasDto = {
        student, // recibo primero los datos del estudiante y luego le añado el array de matriculas
        matriculas: matriculas.map(({ id, subject, teacher, year }) => ({
          id,
          subject: {
            id: subject.id,
            nombre: subject.nombre,
          },
          teacher: {
            id: teacher.id,
            nombre: teacher.nombre,
            apellidos: teacher.apellidos,
            asignaturas: teacher.asignaturas,
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
