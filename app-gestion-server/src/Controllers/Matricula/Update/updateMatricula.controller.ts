import { Controller, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpdateMatriculaService } from './updateMatricula.service';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';

@Controller('matricula')
export class UpdateMatriculaController {
  constructor(
    private readonly updateMatriculaService: UpdateMatriculaService,
  ) {}

  @Put(':id')
  async updateMatricula(
    @Param('id') matriculaId: number,
    @Body()
    updatedData: {
      newSubjectId?: Partial<SubjectDb>; // number
      newTeacherId?: Partial<TeacherDb>; // number
    },
    @Res() response: Response,
  ) {
    try {
      const updatedMatricula =
        await this.updateMatriculaService.updateMatricula(
          matriculaId,
          updatedData.newSubjectId,
          updatedData.newTeacherId,
        );

      if (!updatedMatricula) {
        return response.status(404).json({
          message: 'No se encontró ninguna matrícula para este estudiante',
        });
      }
      console.log('Actualizado con éxito');
      // OPCION DE CONTROLAR LOS DATOS MEDIANTE UN DTO
      const updatedMatriculaDto = {
        id: updatedMatricula.id,
        student: {
          id: updatedMatricula.student.id,
          nombre: updatedMatricula.student.nombre,
          apellidos: updatedMatricula.student.apellidos,
        },
        subject: {
          id: updatedMatricula.subject.id,
          nombre: updatedMatricula.subject.nombre,
        },
        teacher: {
          id: updatedMatricula.teacher.id,
          nombre: updatedMatricula.teacher.nombre,
          apellidos: updatedMatricula.teacher.apellidos,
          asignaturas: updatedMatricula.teacher.asignaturas,
        },
      };
      return response.status(200).json(updatedMatriculaDto); // Devuelve la matricula actualizada
    } catch (error) {
      console.error('Error al actualizar la matrícula:', error);
      throw new Error('No se pudo actualizar la matrícula');
    }
  }
}
