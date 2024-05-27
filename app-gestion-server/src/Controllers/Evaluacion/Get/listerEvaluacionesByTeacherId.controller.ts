import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ListerEvaluacionesByTeacherIdService } from './listerEvaluacionesByTeacherId.service';
import { GetTeacherService } from 'src/Controllers/Teacher/Get/getTeacher.service';

@Controller('evaluaciones')
export class ListerEvaluacionesByTeacherIdController {
  constructor(
    private readonly listerEvaluacionesByTeacherIdService: ListerEvaluacionesByTeacherIdService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  // OBTENER EVALUACIONES POR ID DE PROFESOR
  @Get('teacher/:id')
  async getEvaluacionesByTeacherId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const teacherId = Number(id);

      const teacher = await this.getTeacherService.getTeacher(teacherId);
      if (!teacher) {
        // throw new NotFoundException('No se encuentra este estudiante');
        return response
          .status(404)
          .json({ message: 'No se encuentra este profesor' });
      }

      const evaluaciones =
        await this.listerEvaluacionesByTeacherIdService.getEvaluacionesByTeacherId(
          teacherId,
        );

      if (!evaluaciones || evaluaciones.length === 0) {
        // throw new NotFoundException(
        //   'Evaluaciones no encontradas para este estudiante',
        // );
        return response
          .status(404)
          .json({ message: 'Evauaciones no encontradas para este profesor' });
      }

      // Controlo los datos mediante un DTO
      // const evaluacionesDto = {
      //   // teacher: {
      //   //   id: teacher.id,
      //   //   nombre: teacher.nombre,
      //   //   apellidos: teacher.apellidos,
      //   //   dni: teacher.dni,
      //   //   telefono: teacher.telefono,
      //   //   email: teacher.email,
      //   // },
      //   teacher,
      //   evaluaciones: evaluaciones.map(
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
      // };
      // return evaluacionesDto;
      // console.log(evaluacionesDto);

      return response.status(200).json(evaluacionesDto);
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
