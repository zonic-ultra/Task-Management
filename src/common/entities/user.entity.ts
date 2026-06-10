import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

import { IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { EActions } from '../claims/task-claims.enum';
import { EUserRole } from 'src/common/enums/enum';
import { Project } from './project.entity';
import { ProjectMember } from './project.meber.entity';

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

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

  @OneToMany(() => Task, (task) => task.assignee)
  assigned_tasks: Task[];

  @OneToMany(() => Task, (task) => task.creator)
  created_tasks: Task[];

  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[];

  // @OneToMany(() => Subtask, (subtask) => subtask.creator)
  // subtasks: Subtask[];
}
//  nkdeq0987754UYHGHJH#*cxgbvDLSVDL
