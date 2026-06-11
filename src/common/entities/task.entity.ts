import { ETaskPriority, ETasksStatus } from 'src/common/enums/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { User } from './user.entity';
import { Project } from './project.entity';
@Entity()
export class Tasks {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  // @Column()
  // title: string;

  // @Column()
  // description: string;

  // @Column()
  // status: ETasksStatus;

  // @ManyToOne((_type) => User, (user) => user.task, { eager: false })
  // @Exclude({ toPlainOnly: true })
  // user: User;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ETasksStatus, default: ETasksStatus.TODO })
  status: ETasksStatus;

  @Column({ type: 'enum', enum: ETaskPriority, default: ETaskPriority.LOW })
  priority: ETaskPriority;

  @Column({ name: 'project_id' })
  project_id: number;

  @Column({ name: 'assignee_id', nullable: true })
  assignee_id: number;

  @Column({ name: 'created_by' })
  created_by: number;

  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.assigned_tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @ManyToOne(() => User, (user) => user.created_tasks, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  // @OneToMany(() => Subtask, (subtask) => subtask.task, { cascade: true })
  // subtasks: Subtask[];

  // @OneToMany(() => Comment, (comment) => comment.task, { cascade: true })
  // comments: Comment[];
}
