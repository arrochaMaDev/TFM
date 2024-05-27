import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetStudentService } from 'src/Controllers/Student/Get/getStudent.service';
import { ListerEvaluacionesByStudentIdService } from './listerEvaluacionesByStudentId.service';
import { GetEvaluacionByMatriculaIdService } from './getEvaluacionByMatriculaId.service';
import { GetMatriculaService } from 'src/Controllers/Matricula/Get/getMatricula.service';

@Controller('evaluacion')
export class GetEvaluacionByMatriculaIdController {
  constructor(
    private readonly getEvaluacionByMatriculaIdService: GetEvaluacionByMatriculaIdService,
    private readonly getMatriculaService: GetMatriculaService,
  ) {}

  // OBTENER EVALUACIONES POR ID DE STUDENT
  @Get('matricula/:id')
  async getEvaluacionByMatriculaId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const matriculaId = Number(id);

      const matricula =
        await this.getMatriculaService.getMatricula(matriculaId);
      if (!matricula) {
        // throw new NotFoundException('No se encuentra esta matrícula');
        return response
          .status(404)
          .json({ message: 'No se encuentra esta matrícula' });
      }

      const evaluacion =
        await this.getEvaluacionByMatriculaIdService.getEvaluacionByMatriculaId(
          matriculaId,
        );

      if (!evaluacion) {
        // throw new NotFoundException(
        //   'Evaluación no encontrada para esta matrícula',
        // );
        return response.status(404).json({
          message: 'Evaluación no encontrada para esta matrícula',
        });
      }

      // Controlo los datos mediante un DTO

      const evaluacionDto = {
        id: evaluacion.id,
        nota1: evaluacion.nota1,
        comentario1: evaluacion.comentario1,
        nota2: evaluacion.nota2,
        comentario2: evaluacion.comentario2,
        nota3: evaluacion.nota3,
        comentario3: evaluacion.comentario3,
        matricula: {
          id: evaluacion.matricula.id,
          year: evaluacion.matricula.year,
          student: {
            id: evaluacion.matricula.student.id,
            nombre: evaluacion.matricula.student.nombre,
            apellidos: evaluacion.matricula.student.apellidos,
            dni: evaluacion.matricula.student.dni,
            telefono: evaluacion.matricula.student.telefono,
            email: evaluacion.matricula.student.email,
          },
          teacher: {
            id: evaluacion.matricula.teacher.id,
            nombre: evaluacion.matricula.teacher.nombre,
            apellidos: evaluacion.matricula.teacher.apellidos,
            dni: evaluacion.matricula.teacher.dni,
            telefono: evaluacion.matricula.teacher.telefono,
            email: evaluacion.matricula.teacher.email,
          },
          subject: {
            id: evaluacion.matricula.subject.id,
            nombre: evaluacion.matricula.subject.nombre,
          },
        },
      };
      console.log(evaluacionDto);
      // return evaluacionDto;

      return response.status(200).json(evaluacionDto);
    } catch (error) {
      // throw new Error('Error interno del servidor');
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
