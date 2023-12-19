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
import { IsNumber } from 'class-validator';

@Entity({ name: 'alumnos_asignaturas' })
export class MatriculaDb {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => StudentDb, { eager: true }) // Use eager loading if needed
  // @ManyToOne(() => StudentDb) // No eager loading by default
  @ManyToOne(() => StudentDb, (student: StudentDb) => student.id)
  @JoinColumn({ name: 'alumno' })
  student: StudentDb;

  // @ManyToOne(() => SubjectDb, { eager: true }) // Use eager loading if needed
  // @ManyToOne(() => SubjectDb) // No eager loading by default
  @ManyToOne(() => SubjectDb, (subject: SubjectDb) => subject.id)
  @JoinColumn({ name: 'asignatura' })
  subject: SubjectDb;

  // @ManyToOne(() => TeacherDb, { eager: true }) // Use eager loading if needed
  // @ManyToOne(() => TeacherDb) // No eager loading by default
  @ManyToOne(() => TeacherDb, (teacher: TeacherDb) => teacher.id)
  @JoinColumn({ name: 'profesor' })
  teacher: TeacherDb;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  @IsNumber()
  nota: number;
  // matricula: { id: number; nombre: string };
}
