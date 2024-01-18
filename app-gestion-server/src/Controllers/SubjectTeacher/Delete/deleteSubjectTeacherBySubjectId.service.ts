import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectTeacherDb } from 'src/Modelos/SubjectTeacher/subjectTeacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteSubjectTeacherBySubjectIdService {
  constructor(
    @InjectRepository(SubjectTeacherDb)
    private readonly subjectTeacherRepository: Repository<SubjectTeacherDb>,
  ) {}

  // BORRAR RELACIONES POR ID DE ASIGNATURA
  async deleteSubjectTeacherBySubjectId(
    subjectId: number,
  ): Promise<SubjectTeacherDb[]> {
    const subjectsTeachers = await this.subjectTeacherRepository.find({
      where: {
        subject: { id: subjectId },
      },
      relations: ['subject', 'teacher'],
    });

    if (!subjectsTeachers) {
      throw new Error('Relaciones no encontradas para esta asignatura');
    }
    console.log(subjectsTeachers);

    return await this.subjectTeacherRepository.remove(subjectsTeachers);
  }
}
