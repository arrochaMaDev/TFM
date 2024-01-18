import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteSubjectTeacherService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectTeacherRepository: Repository<SubjectTeacherDb>,
  ) {}

  // BORRAR RELACIONES ASIGNATURA-PROFESOR POR ID
  async deleteSubjectTeacher(id: number): Promise<SubjectTeacherDb | null> {
    const subjectTeacher = await this.subjectTeacherRepository.findOne({
      where: {
        id,
      },
      relations: ['subject', 'teacher'],
    });
    // const subjectTeacher = await this.subjectTeacherRepository
    //   .createQueryBuilder('asignatura_profesor')
    //   .leftJoinAndSelect('asignatura_profesor.subject', 'subject')
    //   .leftJoinAndSelect('asignatura_profesor.teacher', 'teacher')
    //   .where('asignatura_profesor.id = :id', { id })
    //   .getOne();

    if (!subjectTeacher) {
      throw new Error('Relacion asignatura-profesor no encontrada');
    }
    console.log(subjectTeacher);

    return await this.subjectTeacherRepository.remove(subjectTeacher);
  }
}
