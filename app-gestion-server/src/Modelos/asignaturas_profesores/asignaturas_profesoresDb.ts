import {
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectDb } from '../Subject/subjectDb';
import { TeacherDb } from '../Teacher/teacherDb';

@Entity({ name: 'matricula' })
export class MatriculaDb {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => SubjectDb)
  @JoinColumn({ name: 'asignatura' })
  subject: SubjectDb;

  @ManyToMany(() => TeacherDb)
  @JoinColumn({ name: 'profesor' })
  teacher: TeacherDb;
}
