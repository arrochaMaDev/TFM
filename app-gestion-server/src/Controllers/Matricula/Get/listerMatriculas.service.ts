import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatriculaDb } from 'src/Modelos/Matricula/matriculaDb';
import { Repository } from 'typeorm';

@Injectable()
export class ListerMatriculasService {
  constructor(
    @InjectRepository(MatriculaDb)
    private readonly matriculasRepository: Repository<MatriculaDb>,
  ) {}

  async listerMatriculas(): Promise<MatriculaDb[]> {
    const listado = await this.matriculasRepository.find({
      relations: ['student', 'subject', 'teacher'],
    });

    // const listado = await this.matriculasRepository
    //   .createQueryBuilder('matricula')
    //   .leftJoinAndSelect('matricula.student', 'student')
    //   .leftJoinAndSelect('matricula.subject', 'subject')
    //   .leftJoinAndSelect('matricula.teacher', 'teacher')
    //   .getMany();
    // console.table(listado);
    return listado;
  }
}
