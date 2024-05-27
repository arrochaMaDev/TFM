import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ListerEvaluacionesBySubjectIdService } from './listerEvaluacionesBySubjectId.service';
import { GetSubjectService } from 'src/Controllers/Subject/Get/getSubject.service';

@Controller('evaluaciones')
export class ListerEvaluacionesBySubjectIdController {
  constructor(
    private readonly listerEvaluacionesBySubjectIdService: ListerEvaluacionesBySubjectIdService,
    private readonly getSubjectService: GetSubjectService,
  ) {}

  // OBTENER EVALUACIONES POR ID DE STUDENT
  @Get('subject/:id')
  async getEvaluacionesBySubjectId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const subjectId = Number(id);

      const subject = await this.getSubjectService.getSubject(subjectId);
      if (!subject) {
        // throw new NotFoundException('No se encuentra este estudiante');
        return response
          .status(404)
          .json({ message: 'No se encuentra esta asignatura' });
      }

      const evaluaciones =
        await this.listerEvaluacionesBySubjectIdService.getEvaluacionesBySubjectId(
          subjectId,
        );

      if (!evaluaciones || evaluaciones.length === 0) {
        // throw new NotFoundException(
        //   'Evaluaciones no encontradas para este estudiante',
        // );
        return response.status(404).json({
          message: 'Evaluaciones no encontradas para esta asignatura',
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
      // return evaluacionesDto;
      return response.status(200).json(evaluacionesDto);
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
