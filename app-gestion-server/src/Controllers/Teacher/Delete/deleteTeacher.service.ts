import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteTeacherService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
  ) {}

  async deleteTeacher(id: number): Promise<void> {
    const teacher = await this.teacherRepository.findOne({
      where: {
        id,
      },
    });
    if (!teacher) {
      throw new Error('Profesor no encontrado');
    }
    console.log(teacher);
    await this.teacherRepository.remove(teacher);
  }
}
