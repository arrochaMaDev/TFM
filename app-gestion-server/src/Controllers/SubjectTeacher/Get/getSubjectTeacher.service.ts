import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetSubjectTeacherService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectTeacherRepository: Repository<SubjectTeacherDb>,
  ) {}

  // OBTENER RELACIONES POR ID DE RELACIÓN
  async getSubjectTeacher(id: number): Promise<SubjectTeacherDb | null> {
    const subjectTeacher = await this.subjectTeacherRepository.findOne({
      where: {
        id,
      },
      relations: ['subject', 'teacher'],
    });

    // const subjectTeacher = await this.subjectTeacherRepository
    //   .createQueryBuilder('asignaturas_profesores')
    //   .leftJoinAndSelect('asignaturas_profesores.subject', 'subject')
    //   .leftJoinAndSelect('asignaturas_profesores.teacher', 'teacher')
    //   .where('asignaturas_profesores.id = :id', { id })
    //   .getOne();

    return subjectTeacher || null;
  }
}
