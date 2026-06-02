import { EUserRole } from 'src/common/types.common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: EUserRole;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  task: Task[];
}
//  nkdeq0987754UYHGHJH#*cxgbvDLSVDL
