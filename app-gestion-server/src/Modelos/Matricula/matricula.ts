import { Student } from '../Student/student';
import { StudentDb } from '../Student/studentDb';
import { Subject } from '../Subject/subject';
import { SubjectDb } from '../Subject/subjectDb';
import { Teacher } from '../Teacher/teacher';
import { TeacherDb } from '../Teacher/teacherDb';

export class Matricula {
  constructor(
    private readonly id: number,
    private readonly alumno: StudentDb, // en vez de ser el Id, es el propio objeto
    private readonly asignatura: SubjectDb,
    private readonly profesor: TeacherDb,
    private readonly year: number,
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
  getAlumno(): StudentDb {
    return this.alumno;
  }
  getAsignatura(): SubjectDb {
    return this.asignatura;
  }
  getProfesor(): TeacherDb {
    return this.profesor;
  }
  getYear(): number {
    return this.year;
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
