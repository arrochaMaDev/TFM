import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetMatriculaService } from './getMatricula.service';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { GetMatriculaDto } from './getMatriculaDto';
import { GetStudentService } from 'src/Controllers/Student/Get/getStudent.service';
import { StudentDb } from 'src/Modelos/Student/studentDb';

@Controller('matricula')
export class GetMatriculaController {
  constructor(
    private readonly getMatriculaService: GetMatriculaService,
    private readonly getStudentService: GetStudentService,
  ) {}

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
      const matriculaDto = {
        id: matricula.id,
        student: {
          id: matricula.student.id,
          nombre: matricula.student.nombre,
          apellidos: matricula.student.apellidos,
        },
        subject: {
          id: matricula.subject.id,
          nombre: matricula.subject.nombre,
        },
        teacher: {
          id: matricula.teacher.id,
          nombre: matricula.teacher.nombre,
          apellidos: matricula.teacher.apellidos,
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

  // OBTENER MATRICULA POR ID DEL STUDENT
  @Get('student/:id')
  async getMatriculasByStudentId(
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    try {
      const studentId = Number(id);
      const matriculas =
        await this.getMatriculaService.getMatriculasByStudentId(studentId);

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
        student, // es necesario recibir el estudiante???
        matriculas: matriculas.map(({ id, subject, teacher }) => ({
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
