import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetSubjectService {
  constructor(
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
  ) {}

  async getSubject(id: number): Promise<SubjectDb> {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });
    console.log(subject);
    return subject;
  }
}
