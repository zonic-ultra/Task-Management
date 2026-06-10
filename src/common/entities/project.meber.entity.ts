import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';
import { EProjectMemberRole } from '../enums/enum';

@Entity('project_members')
@Unique(['project_id', 'user_id'])
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id' })
  project_id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({
    type: 'enum',
    enum: EProjectMemberRole,
    default: EProjectMemberRole.MEMBER,
  })
  role: EProjectMemberRole;

  @CreateDateColumn()
  joined_at: Date;

  // Relations
  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.project_members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
