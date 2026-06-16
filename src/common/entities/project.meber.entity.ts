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
import { EMemberRole } from '../enums/enum';
import { Transform } from 'class-transformer';

@Entity('project_members')
@Unique(['project_id', 'user_id'])
export class ProjectMember {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'project_id' })
  project_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({
    type: 'enum',
    enum: EMemberRole,
    default: EMemberRole.MEMBER,
  })
  role: EMemberRole;

  @CreateDateColumn()
  @Transform(({ value }) => {
    const d = new Date(value);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  })
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
