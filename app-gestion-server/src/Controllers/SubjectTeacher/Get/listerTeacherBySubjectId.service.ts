import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerSubjectsByTeacherIdService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectsTeachersRepository: Repository<SubjectTeacherDb>,
  ) {}

  // OBTENER ASIGNATURAS POR ID DEL PROFESOR
  async getSubjectsByTeacherId(teacherId: number): Promise<SubjectTeacherDb[]> {
    const subjectsByTeacherId = await this.subjectsTeachersRepository.find({
      where: {
        teacher: { id: teacherId },
      },
      relations: ['subject', 'teacher'],
    });

    return subjectsByTeacherId;
  }
}
