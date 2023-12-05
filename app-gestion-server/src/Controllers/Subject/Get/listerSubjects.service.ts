import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { SubjectDb } from 'src/Modelos/Subject/subjectDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerSubjectsService {
  constructor(
    @InjectRepository(SubjectDb)
    private readonly subjectRepository: Repository<SubjectDb>,
  ) {}

  async listerSubjects(): Promise<SubjectDb[]> {
    const listado = await this.subjectRepository.find();
    console.log(listado);
    return listado;
  }
}
