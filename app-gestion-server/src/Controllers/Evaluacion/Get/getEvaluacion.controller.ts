import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetEvaluacionService } from './getEvaluacion.service';

@Controller('evaluacion')
export class GetEvaluacionController {
  constructor(private readonly getEvaluacionService: GetEvaluacionService) {}

  @Get(':id')
  async getEvaluacion(
    @Param('id') id: number,
    // @Res() response: Response
  ) {
    try {
      const evaluacion = await this.getEvaluacionService.getEvaluacion(
        Number(id),
      );

      // if (!evaluacion) {
      //   return response
      //     .status(404)
      //     .json({ message: 'Evaluacion no encontrada' });
      // }

      // OPCION DE CONTROLAR LOS DATOS MEDIANTE UN DTO
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
      return evaluacionDto;
      // return response.status(200).json(evaluacionDto);
    } catch (error) {
      console.error('Error al obtener la matricula:', error);
      throw new Error('No se pudo obtener la matricula');
      // return response
      //   .status(500)
      //   .json({ message: 'Error interno del servidor' });
    }
  }
}
