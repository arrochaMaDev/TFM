import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatriculaDb } from '../Matricula/matriculaDb';
import { StudentDb } from '../Student/studentDb';
import { TeacherDb } from '../Teacher/teacherDb';
import { SubjectDb } from '../Subject/subjectDb';

@Entity({ name: 'evaluacion' })
export class EvaluacionDb {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => MatriculaDb)
  @JoinColumn({ name: 'matricula' })
  matricula: MatriculaDb;

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
