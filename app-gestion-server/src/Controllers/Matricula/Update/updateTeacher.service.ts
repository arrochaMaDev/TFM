import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { TeacherDb } from 'src/Modelos/Teacher/teacherDb';
import { Repository } from 'typeorm';

@Injectable()
export class UpdateMatriculaService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}
  // Hay 2 opciones: se actualiza la asignatura o el profesor
  async updateMatricula(
    id: number,
    newData: Partial<MatriculaDb>,
  ): Promise<MatriculaDb> {
    const matriculaToUpdate = await this.matriculaRepository.findOne({
      where: { id },
    });

    if (!matriculaToUpdate) {
      throw new Error('Matricula no encontrada');
    }

    const matriculaToUpdate = this.teacherRepository.merge(
      teacherToUpdate,
      newData,
    );

    // Guarda los cambios en la base de datos
    await this.teacherRepository.save(updatedTeacher);

    return teacherToUpdate;
  }
}
