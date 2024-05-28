import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetMatriculaService } from './getMatricula.service';

@Controller('matricula')
export class GetMatriculaController {
  constructor(private readonly getMatriculaService: GetMatriculaService) {}

  // OBTENER MATRICULA POR ID DE LA MATRICULA
  @Get(':id')
  async getMatricula(@Param('id') id: number, @Res() response: Response) {
    try {
      const matricula = await this.getMatriculaService.getMatricula(Number(id));

      if (!matricula) {
        return response
          .status(404)
          .json({ message: 'Matrícula no encontrada' });
      }

      // OPCION DE CONTROLAR LOS DATOS MEDIANTE UN DTO
      // const matriculaDto = {
      //   id: matricula.id,
      //   student: {
      //     id: matricula.student.id,
      //     nombre: matricula.student.nombre,
      //     apellidos: matricula.student.apellidos,
      //   },
      //   subject: {
      //     id: matricula.subject.id,
      //     nombre: matricula.subject.nombre,
      //   },
      //   teacher: {
      //     id: matricula.teacher.id,
      //     nombre: matricula.teacher.nombre,
      //     apellidos: matricula.teacher.apellidos,
      //   },
      //   year: matricula.year,
      //   nota1: matricula.nota1,
      //   comentario1: matricula.comentario1,
      //   nota2: matricula.nota2,
      //   comentario2: matricula.comentario2,
      //   nota3: matricula.nota3,
      //   comentario1: matricula.comentario3,
      // };

      return response.status(200).json(matricula);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
