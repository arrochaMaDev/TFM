import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerMatriculasBySubjectIdService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}

  // OBTENER MATRICULAS POR ID DE STUDENT
  async getMatriculasBySubjectId(subjectId: number): Promise<MatriculaDb[]> {
    const matriculas = await this.matriculaRepository.find({
      where: {
        subject: { id: subjectId },
      },
      relations: ['student', 'subject', 'teacher'],
    });

    return matriculas;
  }
}
