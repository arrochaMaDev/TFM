import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentDb } from '../Student/studentDb';

@Entity({ name: 'asignatura' })
export class SubjectDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => StudentDb, (student: StudentDb) => student.subjects)
  @JoinColumn({ name: 'id' })
  student: StudentDb;
}
