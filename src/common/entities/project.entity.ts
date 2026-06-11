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
import { EProjectStatus } from '../enums/enum';
import { User } from './user.entity';
import { Tasks } from './task.entity';
import { ProjectMember } from './project.meber.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: EProjectStatus,
    default: EProjectStatus.ACTIVE,
  })
  status: EProjectStatus;

  @Column({ name: 'owner_id' })
  owner_id: number;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => ProjectMember, (pm) => pm.project, { cascade: true })
  members: ProjectMember[];

  @OneToMany(() => Tasks, (task) => task.project, { cascade: true })
  tasks: Tasks[];
}
