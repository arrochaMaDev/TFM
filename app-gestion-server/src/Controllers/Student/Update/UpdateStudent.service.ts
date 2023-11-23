import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentDb } from 'src/Modelos/Student/studentDb';

@Injectable()
export class UpdateStudentService {
  constructor(
    @InjectRepository(StudentDb)
    private readonly studentRepository: Repository<StudentDb>,
  ) {}

  async updateStudent(
    id: number,
    newData: Partial<StudentDb>,
  ): Promise<StudentDb> {
    const studentToUpdate = await this.studentRepository.findOne({
      where: { id },
    });

    if (!studentToUpdate) {
      throw new Error('Estudiante no encontrado');
    }

    // Actualiza los campos del estudiante con newData
    Object.assign(studentToUpdate, newData);

    // Guarda los cambios en la base de datos
    await this.studentRepository.save(studentToUpdate);

    return studentToUpdate;
  }
}
