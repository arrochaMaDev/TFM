import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StudentDb } from '../Student/studentDb';

@Entity({ name: 'profesor' })
export class TeacherDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: string;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  email: string;

  @Column()
  asignaturas: string;

  @ManyToOne(() => StudentDb, (student: StudentDb) => student.teacher)
  student: TeacherDb;
}
