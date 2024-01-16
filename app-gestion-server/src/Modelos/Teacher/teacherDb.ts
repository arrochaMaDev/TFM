import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentDb } from '../Student/studentDb';
import { UserDb } from '../User/userDb';

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

  @ManyToOne(() => StudentDb, (student: StudentDb) => student.teachers)
  @JoinColumn({ name: 'id' })
  student: TeacherDb;

  @OneToOne(() => UserDb, (user: UserDb) => user.teacher)
  @JoinColumn({ name: 'userId' })
  user: UserDb;
}
