import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubjectDb } from '../Subject/subjectDb';
import { TeacherDb } from '../Teacher/teacherDb';

@Entity({ name: 'asignaturas_profesores' })
export class SubjectTeacherDb {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubjectDb)
  @JoinColumn({ name: 'asignatura' })
  subject: SubjectDb;

  @ManyToOne(() => TeacherDb)
  @JoinColumn({ name: 'profesor' })
  teacher: TeacherDb;
}
