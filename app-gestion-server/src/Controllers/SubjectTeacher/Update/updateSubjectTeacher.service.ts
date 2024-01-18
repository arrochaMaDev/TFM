import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';
import { GetSubjectTeacherService } from '../Get/getSubjectTeacher.service';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';

@Injectable()
export class UpdateSubjectTeacherService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectTeacherRepository: Repository<SubjectTeacherDb>,
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
    private readonly getSubjectTeacher: GetSubjectTeacherService,
  ) {}

  async updateSubjectTeacher(
    subjectTeacherId: number,
    subject?: Partial<SubjectDb>, // solo se pasa el id, pero se maneja como un objeto en vez de con un number
    teacher?: Partial<TeacherDb>,
  ): Promise<SubjectTeacherDb> {
    try {
      // OBTENGO LA RELACION A ACTUALIZAR
      const subjectTeacherToUpdate =
        await this.getSubjectTeacher.getSubjectTeacher(subjectTeacherId);

      // OBTENGO EL PROFESOR NUEVO A PARTIR DE SU ID
      if (teacher) {
        const newTeacher = await this.teacherRepository.findOne({
          where: {
            id: teacher.id,
          },
        });
        subjectTeacherToUpdate.teacher = newTeacher;

        if (!teacher) {
          throw new Error('Profesor no encontrado');
        }
      }
      // OBTENGO LA ASIGNATURA NUEVA A PARTIR DE SU ID
      if (subject) {
        const newSubject = await this.subjectRepository.findOne({
          where: {
            id: subject.id,
          },
        });
        subjectTeacherToUpdate.subject = newSubject;

        if (!subject) {
          throw new Error('Asignatura no encontrada');
        }
      }
      return this.subjectTeacherRepository.save(subjectTeacherToUpdate);
    } catch (error) {
      console.error('Error al actualizar la matrícula:', error);
      throw new Error('No se pudo actualizar la matrícula');
    }
  }
}
