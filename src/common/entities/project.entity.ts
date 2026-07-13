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
import { Transform } from 'class-transformer';
import { transformDateToISOString } from 'src/utils/common.helper';

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

  @Column({ type: 'date', nullable: true })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @CreateDateColumn()
  @Transform(transformDateToISOString)
  created_at: string;

  @UpdateDateColumn()
  @Transform(transformDateToISOString)
  updated_at: string;

  // Relations
  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => ProjectMember, (pm) => pm.project, { cascade: true })
  members: ProjectMember[];

  @OneToMany(() => Tasks, (task) => task.project, { cascade: true })
  tasks: Tasks[];
}
