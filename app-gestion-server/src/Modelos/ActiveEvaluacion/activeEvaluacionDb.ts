import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'activeEvaluacion' })
export class ActiveEvaluacionDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  activeEval1: number;

  @Column()
  activeEval2: number;

  @Column()
  activeEval3: number;
}
