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
    private readonly profesor: TeacherDb, // private readonly nota: number,
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
  // getNota(): number {
  //   return this.nota;
  // }
  // EL CAMPO NOTA SE RESERVA PARA LA EVALUACION
}
