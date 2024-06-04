import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'evaluacionActiva' })
export class EvaluacionActivaDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  evaluacion1: number;

  @Column()
  evaluacion2: number;

  @Column()
  evaluacion3: number;
}
