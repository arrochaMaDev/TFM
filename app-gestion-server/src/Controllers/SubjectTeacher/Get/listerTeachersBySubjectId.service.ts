import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerTeachersBySubjectIdService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectsTeachersRepository: Repository<SubjectTeacherDb>,
  ) {}

  // OBTENER PROFESORES POR ID DE LA ASIGNATURA
  async getTeachersBySubjectId(subjectId: number): Promise<SubjectTeacherDb[]> {
    const teachersBySubjectId = await this.subjectsTeachersRepository.find({
      where: {
        subject: { id: subjectId },
      },
      relations: [
        'subject',
        'teacher',
        // 'teacher.userId'
      ],
    });

    return teachersBySubjectId;
  }
}
