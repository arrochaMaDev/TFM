import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  permisos: number;

  // Relaciones @OnetoMany para relacionar username y el login con usuario_id de un profesor o de uno o varios alumnos
}
