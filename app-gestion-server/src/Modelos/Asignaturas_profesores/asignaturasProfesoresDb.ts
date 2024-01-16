import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubjectDb } from '../Subject/subjectDb';
import { TeacherDb } from '../Teacher/teacherDb';

@Entity({ name: 'asignaturas_profesores' })
export class AsignaturasProfesoresDb {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubjectDb)
  @JoinColumn({ name: 'asignatura' })
  subject: SubjectDb;

  @ManyToOne(() => TeacherDb)
  @JoinColumn({ name: 'profesor' })
  teacher: TeacherDb;
  // Hay opción de hacerlo con manyToMany y que typeOrm cree la tabla intermedia de forma automática sin necesidad de crearla explícitamente en la BD.
  // En ese caso hay que cambiar las entidades SubjectDb y TeacherDb y añadir @manyToMany en ambas, @JoinTable, etc
}
