import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';

@Injectable()
export class GetMatriculaService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculaRepository: Repository<MatriculaDb>,
  ) {}
  async getMatricula(id: number): Promise<MatriculaDb | null> {
    const matricula = await this.matriculaRepository
      .createQueryBuilder('matricula')
      .leftJoinAndSelect('matricula.student', 'student')
      .leftJoinAndSelect('matricula.subject', 'subject')
      .leftJoinAndSelect('matricula.teacher', 'teacher')
      .where('matricula.id = :id', { id })
      .getOne();

    return matricula || null;
  }
}
