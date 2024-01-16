import { IsEmail, IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubjectDb } from '../Subject/subjectDb';
import { TeacherDb } from '../Teacher/teacherDb';
import { UserDb } from '../User/userDb';

@Entity({ name: 'alumno' })
export class StudentDb {
  @PrimaryGeneratedColumn() // primary column autogenerada
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
  @IsNumber()
  telefono: number;

  @Column()
  @IsEmail()
  email: string;

  @ManyToOne(() => UserDb, (user: UserDb) => user.students)
  @JoinColumn({ name: 'userId' })
  user: UserDb;

  @OneToMany(() => SubjectDb, (subject: SubjectDb) => subject.student)
  subjects: SubjectDb[];

  @OneToMany(() => TeacherDb, (teacher: TeacherDb) => teacher.student)
  teachers: TeacherDb[];
}
