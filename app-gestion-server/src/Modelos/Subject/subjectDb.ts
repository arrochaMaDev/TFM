import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'asignatura' })
export class SubjectDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
}
