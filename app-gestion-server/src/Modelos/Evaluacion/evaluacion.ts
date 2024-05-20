import { MatriculaDb } from '../Matricula/matriculaDb';

export class Evaluacion {
  constructor(
    private readonly id: number,
    private readonly matricula: MatriculaDb,
    private readonly nota1: number,
    private readonly comentario1: string,
    private readonly nota2: number,
    private readonly comentario2: string,
    private readonly nota3: number,
    private readonly comentario3: string,
  ) {}

  getId(): number {
    return this.id;
  }
  getMatricula(): MatriculaDb {
    return this.matricula;
  }
  getNota1(): number {
    return this.nota1;
  }
  getComentario1(): string {
    return this.comentario1;
  }
  getNota2(): number {
    return this.nota2;
  }
  getComentario2(): string {
    return this.comentario2;
  }
  getNota3(): number {
    return this.nota3;
  }
  getComentario3(): string {
    return this.comentario3;
  }
}
