import { ETasksStatus } from 'src/common/types.common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ETasksStatus;
}
