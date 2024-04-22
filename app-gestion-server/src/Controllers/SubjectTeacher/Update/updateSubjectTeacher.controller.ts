import { Controller, Put, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { UpdateSubjectTeacherService } from './updateSubjectTeacher.service';

@Controller('asignatura_profesor')
export class UpdateSubjectTeacherController {
  constructor(
    private readonly updateSubjectTeacherService: UpdateSubjectTeacherService,
  ) {}

  @Put(':id')
  async updateSubjectTeacher(
    @Param('id') id: number,
    @Body()
    updatedData: {
      newSubject?: Partial<SubjectDb>; // en este caso se maneja en la petición mediante las propiedades del objeto
      newTeacher?: Partial<TeacherDb>;
      // newTeacherId?: number // Otra opción es manejarlo como number. En este caso, solo le estaremos pasando el id. No el objeto y sus propiedades
    },
    @Res() response: Response,
  ) {
    try {
      const updatedSubjectTeacher =
        await this.updateSubjectTeacherService.updateSubjectTeacher(
          id,
          updatedData.newSubject,
          updatedData.newTeacher,
        );

      if (!updatedSubjectTeacher) {
        return response.status(404).json({
          message: 'No se encontró ninguna relación asignatura-profesor',
        });
      }
      console.log('Actualizado con éxito');

      // CONTROLO LOS DATOS DE RESPUESTA MEDIANTE UN DTO
      const updatedSubjectTeacherDto = {
        id: updatedSubjectTeacher.id,
        subject: {
          id: updatedSubjectTeacher.subject.id,
          nombre: updatedSubjectTeacher.subject.nombre,
        },
        teacher: {
          id: updatedSubjectTeacher.teacher.id,
          nombre: updatedSubjectTeacher.teacher.nombre,
          apellidos: updatedSubjectTeacher.teacher.apellidos,
          dni: updatedSubjectTeacher.teacher.dni,
        },
      };
      return response.status(200).json(updatedSubjectTeacherDto);
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw new Error('No se pudo actualizar');
    }
  }
}
