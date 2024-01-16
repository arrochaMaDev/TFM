import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetTeacherService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
  ) {}

  async getTeacher(id: number): Promise<TeacherDb> {
    // const teacher = await this.teacherRepository.findOne({
    //   where: {
    //     id,
    //   },
    // });
    const teacher = await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.userId', 'user')
      .where('teacher.id = :id', { id })
      .getOne();
    console.log(teacher);
    return teacher;
  }
}
