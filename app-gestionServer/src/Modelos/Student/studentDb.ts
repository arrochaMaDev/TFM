import { IsEmail, IsNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
