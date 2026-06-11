import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Tasks } from './task.entity';

import { IsEmail, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { EActions } from '../claims/task-claims.enum';
import { EUserRole } from 'src/common/enums/enum';
import { Project } from './project.entity';
import { ProjectMember } from './project.meber.entity';

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  name: string;

  @IsEmail()
  @Column({ length: 150, unique: true })
  username: string;

  @Exclude()
  @Column({ name: 'password' })
  password: string;

  @Column()
  role: EUserRole;

  @Column({ type: 'simple-array', nullable: true })
  @IsEnum(EActions)
  claims: string[]; // ← was string[], now EActions[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @OneToMany(() => ProjectMember, (pm) => pm.user)
  project_members: ProjectMember[];

  @OneToMany(() => Tasks, (task) => task.assignee)
  assigned_tasks: Tasks[];

  @OneToMany(() => Tasks, (task) => task.creator)
  // @Exclude({ toPlainOnly: true })
  created_tasks: Tasks[];

  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[];

  // @OneToMany(() => Subtask, (subtask) => subtask.creator)
  // subtasks: Subtask[];
}
//  nkdeq0987754UYHGHJH#*cxgbvDLSVDL
