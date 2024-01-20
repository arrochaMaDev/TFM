import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerMatriculasByTeacherIdService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}

  // OBTENER MATRICULAS POR ID DE STUDENT
  async getMatriculasByTeacherId(teacherId: number): Promise<MatriculaDb[]> {
    const matriculas = await this.matriculaRepository.find({
      where: {
        teacher: { id: teacherId },
      },
      relations: ['student', 'subject', 'teacher'],
    });

    return matriculas;
  }
}
