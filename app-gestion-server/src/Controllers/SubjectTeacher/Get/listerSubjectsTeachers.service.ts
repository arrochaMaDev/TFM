import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerSubjectsTeachersService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectsTeachersRepository: Repository<SubjectTeacherDb>,
  ) {}

  async listerSubjectTeachers(): Promise<SubjectTeacherDb[]> {
    const listado = await this.subjectsTeachersRepository.find({
      relations: ['subject', 'teacher'],
    });
    // const listado = await this.subjectsTeachersRepository
    //   .createQueryBuilder('asignaturas_profesores')
    //   .leftJoinAndSelect('asignaturas_profesores.subject', 'subject')
    //   .leftJoinAndSelect('asignaturas_profesores.teacher', 'teacher')
    //   .getMany();
    console.table(listado);
    return listado;
  }
}
