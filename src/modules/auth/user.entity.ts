import { EUserRole } from 'src/common/types.common';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';

import { IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { EActions } from '../tasks/claims/task-claims.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
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
