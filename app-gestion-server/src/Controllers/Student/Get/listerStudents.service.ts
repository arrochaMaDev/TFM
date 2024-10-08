import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerStudentsService {
  constructor(
    @InjectRepository(StudentDb)
    private readonly studentsRepository: Repository<StudentDb>,
  ) {}

  async listerStudents(): Promise<StudentDb[]> {
    // const listado = await this.studentsRepository.find();
    const listado = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.userId', 'user')
      .getMany();
    console.log(listado);
    return listado;
  }
}
