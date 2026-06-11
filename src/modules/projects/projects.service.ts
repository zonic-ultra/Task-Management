/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query } from 'axios';
import {
  CreateProjectDto,
  UpdateProjectDto,
} from 'src/common/dtos/project.dto';
import { Project } from 'src/common/entities/project.entity';
import { User } from 'src/common/entities/user.entity';
import { NotFoundException, NotOwnerException } from 'src/exceptions/exception';
// import { NotFoundException } from 'src/exceptions/exception';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project, 'main_repo')
    private readonly projectRepo: Repository<Project>,
  ) {}

  async getProjects(owner_id: User): Promise<Project[]> {
    const query = this.projectRepo.createQueryBuilder('project');
    query.where({ owner_id });

    const projects = await query.getMany();

    return projects;
    // return await this.projectRepo.find();
  }

  async createProject(
    owner: number,
    projectDto: CreateProjectDto,
  ): Promise<Project> {
    const project = this.projectRepo.create({
      ...projectDto,
      owner_id: owner,
    });

    await this.projectRepo.save(project);
    return project;
  }

  async update(
    id: number,
    updateDto: UpdateProjectDto,
    userId: number,
  ): Promise<Project> {
    const project = await this.findById(id);

    if (project.owner_id !== userId) {
      throw new ForbiddenException(
        'Only the project owner can update this project',
      );
    }

    Object.assign(project, updateDto);

    return this.projectRepo.save(project);
  }

  async findById(id: number): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      // relations: ['owner', 'members', 'tasks'],
    });
    if (!project) {
      throw new NotFoundException(id);
    }
    return project;
  }
}
