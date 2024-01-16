import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentDb } from '../Student/studentDb';
import { TeacherDb } from '../Teacher/teacherDb';

@Entity({ name: 'usuario' })
export class UserDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  pass: string;

  @Column()
  permiso: number;

  @OneToMany(() => StudentDb, (student: StudentDb) => student.userId)
  students: StudentDb[];

  @OneToOne(() => TeacherDb, (teacher: TeacherDb) => teacher.userId)
  teacher: TeacherDb;
}
