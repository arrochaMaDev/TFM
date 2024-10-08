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

  // OBTENER MATRICULAS POR ID DE MATRICULA
  async getMatricula(id: number): Promise<MatriculaDb | null> {
    // se pone null para gestionar mejor si no se obtiene ninguna matricula, porque si no devuelve undefined
    const matricula = await this.matriculaRepository
      .createQueryBuilder('matricula')
      .leftJoinAndSelect('matricula.student', 'student')
      .leftJoinAndSelect('matricula.subject', 'subject')
      .leftJoinAndSelect('matricula.teacher', 'teacher')
      .where('matricula.id = :id', { id })
      .getOne();
    // const matricula = await this.matriculaRepository.findOne({
    //   where: {
    //     id: id,
    //   },
    // });

    return matricula || null;
  }
}
