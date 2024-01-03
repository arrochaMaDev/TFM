import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetMatriculaService } from './getMatricula.service';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { GetMatriculaDto } from './getMatriculaDto';

@Controller('matricula')
export class GetMatriculaController {
  constructor(private readonly getMatriculaService: GetMatriculaService) {}

  @Get(':id')
  async getMatricula(@Param('id') id: number, @Res() response: Response) {
    try {
      const matricula = await this.getMatriculaService.getMatricula(Number(id));

      if (!matricula) {
        return response
          .status(404)
          .json({ message: 'Matrícula no encontrada' });
      }

      const matriculaDto: GetMatriculaDto = {
        id: matricula.id,
        student: {
          id: matricula.student.id,
          usuario_id: matricula.student.usuario_id,
          nombre: matricula.student.nombre,
          apellidos: matricula.student.apellidos,
          dni: matricula.student.dni,
          direccion: matricula.student.direccion,
          telefono: matricula.student.telefono,
          email: matricula.student.email,
        },
        subject: {
          id: matricula.subject.id,
          nombre: matricula.subject.nombre,
        },
        teacher: {
          id: matricula.teacher.id,
          nombre: matricula.teacher.nombre,
          apellidos: matricula.teacher.apellidos,
          email: matricula.teacher.email,
          asignaturas: matricula.teacher.asignaturas,
        },
      };
      return response.status(200).json(matriculaDto);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: 'Error interno del servidor' });
    }
  }
}
