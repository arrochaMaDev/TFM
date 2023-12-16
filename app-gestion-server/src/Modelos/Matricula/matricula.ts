import { Student } from '../Student/student';
import { Subject } from '../Subject/subject';
import { Teacher } from '../Teacher/teacher';

export class Matricula {
  constructor(
    private readonly id: number,
    private readonly alumno: number,
    private readonly asignatura: number,
    private readonly profesor: number,
    private readonly nota: number,
  ) {}

  getId(): number {
    return this.id;
  }
  getAlumnoId(): number {
    return this.alumno;
  }
  getAsignaturaId(): number {
    return this.asignatura;
  }
  getProfesorId(): number {
    return this.profesor;
  }
  getNota(): number {
    return this.nota;
  }
}
