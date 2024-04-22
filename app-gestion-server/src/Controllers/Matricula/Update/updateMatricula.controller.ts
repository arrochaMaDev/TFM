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
      newSubject?: Partial<SubjectDb>; // en este caso se maneja en la petición mediante las propiedades del objeto
      newTeacher?: Partial<TeacherDb>;
      // newTeacherId?: number // Otra opción es manejarlo como number. En este caso, solo le estaremos pasando el id. No el objeto y sus propiedades
    },
    @Res() response: Response,
  ) {
    try {
      const updatedMatricula =
        await this.updateMatriculaService.updateMatricula(
          matriculaId,
          updatedData.newSubject,
          updatedData.newTeacher,
        );

      if (!updatedMatricula) {
        return response.status(404).json({
          message: 'No se encontró ninguna matrícula para este estudiante',
        });
      }
      console.log('Actualizado con éxito');

      // CONTROLO LOS DATOS DE RESPUESTA MEDIANTE UN DTO
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
          dni: updatedMatricula.teacher.dni,
        },
        year: updatedMatricula.year,
      };
      return response.status(200).json(updatedMatriculaDto); // Devuelve la matricula actualizada
    } catch (error) {
      console.error('Error al actualizar la matrícula:', error);
      throw new Error('No se pudo actualizar la matrícula');
    }
  }
}
