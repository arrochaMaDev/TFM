import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StudentDb } from '../Student/studentDb';

@Entity({ name: 'asignatura' })
export class SubjectDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @ManyToOne(() => StudentDb, (student: StudentDb) => student.subject)
  student: StudentDb[];
}
