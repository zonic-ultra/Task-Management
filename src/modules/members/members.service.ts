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
import {
  AddMemberDto,
  UpdateMemberDto,
} from 'src/common/dtos/project-member.dto';
import { Project } from 'src/common/entities/project.entity';
import { ProjectMember } from 'src/common/entities/project.meber.entity';
import { User } from 'src/common/entities/user.entity';
import { EMemberRole, EUserRole } from 'src/common/enums/enum';
import { MemberResponseDto } from 'src/common/response/member.response.dto';
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

  async members(project_id: number, user: User): Promise<MemberResponseDto[]> {
    const project = await this.projectRepo.findOne({
      where: { id: project_id },
    });

    if (!project) {
      throw new NotFoundException('Project not found!');
    }

    if (project.owner_id !== user.id) {
      throw new ForbiddenException('Only the project owner can view members');
    }

    const members = await this.memberRepo.find({
      where: { project_id },
      relations: ['user'],
    });

    return members.map((m) => this.toMemberResponse(m));
  }

  private toMemberResponse(member: ProjectMember): MemberResponseDto {
    return {
      id: member.id,
      project_id: member.project_id,
      role: member.role,
      joined_at: member.joined_at,
      name: member.user.name,
    };
  }

  async updateMember(
    id: number,
    update: UpdateMemberDto,
    user: User,
  ): Promise<ProjectMember> {
    const member = await this.findMemberById(id);

    const isPM = user.role === EUserRole.PROJECT_MANAGER;

    if (!isPM) {
      throw new ForbiddenException(
        'You are not allowed to update this member only the project manager',
      );
    }

    member.role = update.role;

    return this.memberRepo.save(member);
  }

  async deleteMember(id: number, user: User): Promise<void> {
    const member = await this.findMemberById(id);

    const isPM = user.role === EUserRole.PROJECT_MANAGER;

    if (!isPM) {
      throw new ForbiddenException(
        ' Only project manager are allowed to delete',
      );
    }

    await this.memberRepo.delete(member.id);
  }

  async findMemberById(id: number): Promise<ProjectMember> {
    const member = await this.memberRepo.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(id);
    }
    return member;
  }
}
