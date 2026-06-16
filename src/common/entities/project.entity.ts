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
  @Transform(({ value }) => {
    const d = new Date(value);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Transform(({ value }) => {
    const d = new Date(value);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })
  end_date: Date;

  @CreateDateColumn()
  @Transform(({ value }) => {
    const d = new Date(value);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })
  created_at: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => {
    const d = new Date(value);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })
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
