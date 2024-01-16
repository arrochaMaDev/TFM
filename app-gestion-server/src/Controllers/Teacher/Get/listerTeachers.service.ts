import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerTeachersService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teachersRepository: Repository<TeacherDb>,
  ) {}

  async listerTeachers(): Promise<TeacherDb[]> {
    // const listado = await this.teachersRepository.find();
    const listado = await this.teachersRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.userId', 'user')
      .getMany();
    console.log(listado);
    return listado;
  }
}
