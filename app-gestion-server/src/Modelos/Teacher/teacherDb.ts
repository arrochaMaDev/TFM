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
  dni: string;

  @Column()
  direccion: string;

  @Column()
  telefono: number;

  @Column()
  email: string;

  @Column()
  foto: string;

  // @ManyToOne(() => StudentDb, (student: StudentDb) => student.teachers)
  @ManyToOne(() => StudentDb)
  @JoinColumn({ name: 'id' })
  student: TeacherDb;

  // @OneToOne(() => UserDb, (user: UserDb) => user.teacher)
  @OneToOne(() => UserDb)
  @JoinColumn({ name: 'userId' })
  userId: UserDb;
}
