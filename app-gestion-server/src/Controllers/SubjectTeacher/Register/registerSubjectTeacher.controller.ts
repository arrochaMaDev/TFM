import { Body, Controller, Post } from '@nestjs/common';
import { RegisterSubjectTeacherService } from './registerSubjectTeacher.service';
import { RegisterSubjectTeacherDto } from './registerSubjectTeacher.dto';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';

@Controller('asignatura_profesor')
export class RegisterSubjectTeacherController {
  constructor(
    private readonly registerSubjectTeacherService: RegisterSubjectTeacherService,
  ) {}

  @Post()
  async registerSubjectTeacherController(
    @Body() data: RegisterSubjectTeacherDto,
  ) {
    try {
      // const { asignatura, profesor } = data;
      const subjectTeacherData =
        await this.registerSubjectTeacherService.createSubjectTeacher(data);

      const subjectTeacher = {
        asignatura: subjectTeacherData.subject.nombre,
        profesor: {
          nombre: subjectTeacherData.teacher.nombre,
          apellidos: subjectTeacherData.teacher.apellidos,
        },
      };

      return subjectTeacher;
    } catch (error) {
      console.error('Error al crear la relación Asignatura-Profesor:', error);
      throw new Error('No se pudo crear la relación Asignatura-Profesor');
    }
  }
}
