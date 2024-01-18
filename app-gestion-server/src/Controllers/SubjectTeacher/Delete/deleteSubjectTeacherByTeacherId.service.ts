import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteSubjectTeacherByTeacherIdService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectTeacherRepository: Repository<SubjectTeacherDb>,
  ) {}

  // BORRAR RELACIONES POR ID DE PROFESOR
  async deleteSubjectTeacherByTeacherId(
    teacherId: number,
  ): Promise<SubjectTeacherDb[]> {
    const subjectsTeachers = await this.subjectTeacherRepository.find({
      where: {
        teacher: { id: teacherId },
      },
      relations: ['subject', 'teacher'],
    });

    if (!subjectsTeachers) {
      throw new Error('Relaciones no encontradas para este profesor');
    }
    console.log(subjectsTeachers);

    return await this.subjectTeacherRepository.remove(subjectsTeachers);
  }
}
