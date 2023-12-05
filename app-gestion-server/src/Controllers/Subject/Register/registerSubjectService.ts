import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/Modelos/Subject/subject';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { Repository } from 'typeorm';

@Injectable()
export class RegisterSubjectService {
  constructor(
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
  ) {}

  async createSubject(nombre: string) {
    const subject = new Subject(0, nombre);
    console.log(subject);

    const subjectDb: SubjectDb = {
      id: subject.getId(),
      nombre: subject.getNombre(),
    };
    console.log(subjectDb);

    await this.subjectRepository.insert(subjectDb);
  }
}
