/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMemberDto } from 'src/common/dtos/project-member.dto';
import { Project } from 'src/common/entities/project.entity';
import { ProjectMember } from 'src/common/entities/project.meber.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(ProjectMember, 'main_repo')
    private readonly memberRepo: Repository<ProjectMember>,

    @InjectRepository(Project, 'main_repo')
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User, 'main_repo')
    private readonly userRepo: Repository<User>,
  ) {}

  async addMember(
    project_id: number,
    dto: AddMemberDto,
    currentUser: User,
  ): Promise<ProjectMember> {
    const project = await this.projectRepo.findOne({
      where: { id: project_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // only the PM who OWNS the project can add members
    if (project.owner_id !== currentUser.id) {
      throw new ForbiddenException('Only the project owner can add members');
    }

    // find user by email
    const userToAdd = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (!userToAdd) {
      throw new NotFoundException(`User with email ${dto.username} not found`);
    }

    // check if already a member
    const existing = await this.memberRepo.findOne({
      where: { project_id: project_id, user_id: userToAdd.id },
    });

    if (existing) {
      throw new ConflictException(
        `${dto.username} is already a member of this project`,
      );
    }

    const member = this.memberRepo.create({
      project_id: project_id,
      user_id: userToAdd.id,
      role: dto.role,
    });

    return this.memberRepo.save(member);
  }

  async members(user_id: User): Promise<ProjectMember[]> {
    const query = this.memberRepo.createQueryBuilder('members');

    query.where({ user_id });

    const members = await query.getMany();

    return members;
  }
}
