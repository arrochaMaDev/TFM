import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentDb } from '../Student/studentDb';
import { SubjectDb } from '../Subject/subjectDb';
import { TeacherDb } from '../Teacher/teacherDb';

@Entity({ name: 'matricula' })
export class MatriculaDb {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => StudentDb, { eager: true })
  // @ManyToOne(() => StudentDb, (student: StudentDb) => student.id)
  @ManyToOne(() => StudentDb)
  @JoinColumn({ name: 'alumno' })
  student: StudentDb;

  // @ManyToOne(() => SubjectDb, { eager: true })
  // @ManyToOne(() => SubjectDb, (subject: SubjectDb) => subject.id)
  @ManyToOne(() => SubjectDb)
  @JoinColumn({ name: 'asignatura' })
  subject: SubjectDb;

  // @ManyToOne(() => TeacherDb, { eager: true })
  // @ManyToOne(() => TeacherDb, (teacher: TeacherDb) => teacher.id)
  @ManyToOne(() => TeacherDb)
  @JoinColumn({ name: 'profesor' })
  teacher: TeacherDb;

  @Column()
  year: number;

  @Column()
  nota1: number;

  @Column()
  comentario1: string;

  @Column()
  nota2: number;

  @Column()
  comentario2: string;

  @Column()
  nota3: number;

  @Column()
  comentario3: string;
}
