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
    const teacher = await this.teacherRepository.findOne({
      where: {
        id,
      },
    });
    console.log(teacher);
    return teacher;
  }
}
