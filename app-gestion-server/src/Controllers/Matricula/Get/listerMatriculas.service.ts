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
    const listado = await this.matriculasRepository.find();
    console.log(listado);
    return listado;
  }
}
