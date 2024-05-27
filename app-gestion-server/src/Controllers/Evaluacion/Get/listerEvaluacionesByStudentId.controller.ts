import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetStudentService } from 'src/Controllers/Student/Get/getStudent.service';
import { ListerEvaluacionesByStudentIdService } from './listerEvaluacionesByStudentId.service';

@Controller('evaluaciones')
export class ListerEvaluacionesByStudentIdController {
  constructor(
    private readonly listerEvaluacionesByStudentIdService: ListerEvaluacionesByStudentIdService,
    private readonly getStudentService: GetStudentService,
  ) {}

  // OBTENER EVALUACIONES POR ID DE STUDENT
  @Get('student/:id')
  async getEvaluacionesByStudentId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const studentId = Number(id);

      const student = await this.getStudentService.getStudent(studentId);
      if (!student) {
        // throw new NotFoundException('No se encuentra este estudiante');
        return response
          .status(404)
          .json({ message: 'No se encuentra este estudiante' });
      }

      const evaluaciones =
        await this.listerEvaluacionesByStudentIdService.getEvaluacionesByStudentId(
          studentId,
        );

      if (!evaluaciones || evaluaciones.length === 0) {
        // throw new NotFoundException(
        //   'Evaluaciones no encontradas para este estudiante',
        // );
        return response.status(404).json({
          message: 'Evaluaciones no encontradas para este estudiante',
        });
      }

      // Controlo los datos mediante un DTO
      const evaluacionesDto = evaluaciones.map(
        ({
          id,
          matricula,
          nota1,
          comentario1,
          nota2,
          comentario2,
          nota3,
          comentario3,
        }) => ({
          id,
          matricula: {
            id: matricula.id,
            student: {
              id: matricula.student.id,
              nombre: matricula.student.nombre,
              apellidos: matricula.student.apellidos,
              dni: matricula.student.dni,
              telefono: matricula.student.telefono,
              email: matricula.student.email,
            },
            teacher: {
              id: matricula.teacher.id,
              nombre: matricula.teacher.nombre,
              apellidos: matricula.teacher.apellidos,
              dni: matricula.teacher.dni,
              telefono: matricula.teacher.telefono,
              email: matricula.teacher.email,
            },
            subject: {
              id: matricula.subject.id,
              nombre: matricula.subject.nombre,
            },
            year: matricula.year,
          },
          nota1,
          comentario1,
          nota2,
          comentario2,
          nota3,
          comentario3,
        }),
      );
      return response.status(200).json(evaluacionesDto);
    } catch (error) {
      // throw new Error('Error interno del servidor');
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
