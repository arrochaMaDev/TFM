import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerMatriculasByStudentIdService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}

  // OBTENER MATRICULAS POR ID DE STUDENT
  async getMatriculasByStudentId(studentId: number): Promise<MatriculaDb[]> {
    const matriculas = await this.matriculaRepository.find({
      where: {
        student: { id: studentId },
      },
      relations: ['student', 'subject', 'teacher'],
    });

    return matriculas;
  }
}
