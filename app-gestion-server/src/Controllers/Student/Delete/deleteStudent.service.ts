import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDb } from 'src/Modelos/Student/studentDb';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteStudentService {
  constructor(
    @InjectRepository(StudentDb)
    private readonly studentRepository: Repository<StudentDb>,
  ) {}

  async deleteStudent(id: number): Promise<StudentDb> {
    const student = await this.studentRepository.findOne({
      where: {
        id,
      },
    });
    if (!student) {
      throw new Error('Usuario no encontrado');
    }
    console.log(student);
    return await this.studentRepository.remove(student);
  }
}
