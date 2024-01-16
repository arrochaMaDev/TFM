import { SubjectDb } from '../Subject/subjectDb';
import { TeacherDb } from '../Teacher/teacherDb';

export class Matricula {
  constructor(
    private readonly id: number,
    private readonly asignatura: SubjectDb,
    private readonly profesor: TeacherDb,
  ) {}

  getId(): number {
    return this.id;
  }
  getAsignatura(): SubjectDb {
    return this.asignatura;
  }
  getProfesor(): TeacherDb {
    return this.profesor;
  }
}
