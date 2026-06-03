import { EUserRole } from 'src/common/types.common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { EActions } from '../../common/task-claims.enum';
import { IsEnum } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column('simple-array')
  @IsEnum(EActions)
  claims: string[];
}
//  nkdeq0987754UYHGHJH#*cxgbvDLSVDL
