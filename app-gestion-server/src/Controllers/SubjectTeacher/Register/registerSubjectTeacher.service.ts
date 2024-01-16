import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';
import { RegisterSubjectTeacherDto } from './registerSubjectTeacher.dto';
import { GetSubjectService } from '../../Subject/Get/getSubject.service';
import { GetTeacherService } from '../../Teacher/Get/getTeacher.service';
import { SubjectTeacher } from 'src/Modelos/SubjectTeacher/subjectTeacher';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';

@Injectable()
export class RegisterSubjectTeacherService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectTeacherRepository: Repository<SubjectTeacherDb>,
    private readonly getSubjectService: GetSubjectService,
    private readonly getTeacherService: GetTeacherService,
  ) {}

  async createSubjectTeacher(
    data: RegisterSubjectTeacherDto,
    // asignatura: number,
    // profesor: number,
  ) {
    try {
      const { asignatura, profesor } = data;

      // Obtengo los objetos asignatura y profesor completos
      const subject = await this.getSubjectService.getSubject(asignatura);
      console.log(subject);

      const teacher = await this.getTeacherService.getTeacher(profesor);
      console.log(teacher);

      const subjectTeacher = new SubjectTeacher(
        0, // id
        subject,
        teacher,
      );
      console.log(subjectTeacher);

      // Opción con el método create. Crea un objeto con los parámetros de la entidad de subjectTeacherRepository, similar a new SubjectTeacher:

      // const subjectTeacher = this.subjectTeacherRepository.create({
      //   subject: { id: asignatura },
      //   teacher: { id: profesor },
      // });
      // const subjectTeacherJSON = JSON.stringify(subjectTeacher);
      // console.table(subjectTeacherJSON);

      const subjectTeacherDb: Partial<SubjectTeacherDb> = {
        id: subjectTeacher.getId(),
        subject: subjectTeacher.getAsignatura(),
        teacher: subjectTeacher.getProfesor(),
      };
      console.table(subjectTeacherDb);

      await this.subjectTeacherRepository.insert(subjectTeacherDb);

      return subjectTeacherDb;
    } catch (error) {
      console.error('Error al crear la relación Asignatura-Profesor', error);
      throw new Error('No se pudo crear la  relación Asignatura-Profesor');
    }
  }
}
