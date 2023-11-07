import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // Relaciones @OnetoMany o lo que sea para sacar la lista de asignaturas de ese profesor
}
