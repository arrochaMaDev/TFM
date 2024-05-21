import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateTeacherService {
  constructor(
    @InjectRepository(TeacherDb)
    private readonly teacherRepository: Repository<TeacherDb>,
  ) {}

  async updateTeacher(
    id: number,
    newData: Partial<TeacherDb>,
  ): Promise<TeacherDb> {
    const teacherToUpdate = await this.teacherRepository.findOne({
      where: { id },
    });

    if (!teacherToUpdate) {
      throw new Error('Profesor no encontrado');
    }

    // Actualiza los campos del profesor con newData
    // Object.assign(teacherToUpdate, newData);
    // en vez de usar el método Object.assign, uso merge:
    const updatedTeacher = await this.teacherRepository.merge(
      teacherToUpdate,
      newData,
    );

    // Guarda los cambios en la base de datos
    await this.teacherRepository.save(updatedTeacher);

    return teacherToUpdate;
  }
}
