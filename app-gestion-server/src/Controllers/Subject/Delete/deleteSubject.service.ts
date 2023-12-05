import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteSubjectService {
  constructor(
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
  ) {}

  async deleteSubject(id: number): Promise<void> {
    const student = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });
    if (!student) {
      throw new Error('Usuario no encontrado');
    }
    console.log(student);
    await this.subjectRepository.remove(student);
  }
}
