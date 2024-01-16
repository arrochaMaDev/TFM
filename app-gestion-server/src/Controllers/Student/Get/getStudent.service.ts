import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetStudentService {
  constructor(
    @InjectRepository(StudentDb)
    private readonly studentRepository: Repository<StudentDb>,
  ) {}

  async getStudent(id: number): Promise<StudentDb> {
    // const student = await this.studentRepository.findOne({
    //   where: {
    //     id,
    //   },
    // });
    const student = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.userId', 'user')
      .where('student.id = :id', { id })
      .getOne();
    console.log(student);
    return student;
  }
}
