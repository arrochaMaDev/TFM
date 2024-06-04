import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetTeacherByUserIdService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
  ) {}

  // OBTENER TEACHER POR ID DE USUARIO
  async getTeacherByUserId(userId: number): Promise<TeacherDb> {
    const teacher = await this.teacherRepository.findOne({
      where: {
        userId: { id: userId },
      },
      relations: ['userId'],
    });

    return teacher;
  }
}
