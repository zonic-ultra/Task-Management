import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateProjectDto,
  GetProjectDto,
  UpdateProjectDto,
} from 'src/common/dtos/project.dto';
import { Project } from 'src/common/entities/project.entity';
import { ICustomRequest, IResponse } from 'src/utils/common.interface';
import { Repository } from 'typeorm';
import { Response } from 'express';
import {
  expressResponse,
  extractUser,
  parseToDatabaseDate,
} from 'src/utils/common.helper';
import { ErrorCode } from 'src/common/enums/enum';
import { RedisCacheService } from 'src/common/redis/redis-cach.service';
import { projectKey, projectsByOwnerKey } from 'src/common/redis/redis.keys';
import { PROJECT_TTL } from 'src/common/redis/redis.ttl';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project, 'main_repo')
    private readonly projectRepo: Repository<Project>,
    private readonly redis: RedisCacheService,
  ) {}

  // async getProjects(owner_id: User): Promise<IResponse<Project[]>> {
  //   const query = this.projectRepo.createQueryBuilder('project');
  //   query.where({ owner_id });

  //   const projects = await query.getMany();

  //   return Response.success(projects);
  //   // return await this.projectRepo.find();
  // }

  // async createProject(
  //   owner: number,
  //   projectDto: CreateProjectDto,
  // ): Promise<IResponse<Project>> {
  //   const project = this.projectRepo.create({
  //     ...projectDto,
  //     owner_id: owner,
  //   });

  //   await this.projectRepo.save(project);
  //   return Response.success(project);
  // }

  // async update(
  //   id: number,
  //   updateDto: UpdateProjectDto,
  //   userId: number,
  // ): Promise<Project> {
  //   const project = await this.findById(id);

  //   if (project.owner_id !== userId) {
  //     throw new ForbiddenException(
  //       'Only the project owner can update this project',
  //     );
  //   }

  //   Object.assign(project, updateDto);

  //   return this.projectRepo.save(project);
  // }

  // async getProject(dto: GetProjectDto, req: ICustomRequest, res: Response) {
  //   const response: IResponse = { code: HttpStatus.ACCEPTED, data: null };

  //   try {
  //     const { id: userId } = extractUser(req);

  //     if (!userId) {
  //       response.data = { code: ErrorCode.USER_DOES_NOT_EXIST };
  //       response.code = HttpStatus.BAD_REQUEST;
  //       return;
  //     }

  //     if (!dto.id) {
  //       response.data = { code: ErrorCode.DTO_VALIDATION_ERROR };
  //       response.code = HttpStatus.BAD_REQUEST;
  //       return;
  //     }

  //     const cacheKey = projectKey(dto.id);
  //     const cached = await this.redis.get<Project>(cacheKey);

  //     if (cached) {
  //       response.data = { code: 0, data: cached };
  //       response.code = HttpStatus.OK;
  //       return;
  //     }

  //     const project = await this.projectRepo.findOne({
  //       where: { id: dto.id, owner_id: userId },
  //       select: {
  //         id: true,
  //         title: true,
  //         description: true,
  //         status: true,
  //         start_date: true,
  //         end_date: true,
  //         created_at: true,
  //         updated_at: true,
  //       },
  //     });

  //     if (!project) {
  //       response.data = { code: ErrorCode.PROJECT_NOT_FOUND };
  //       response.code = HttpStatus.NOT_FOUND;
  //       return;
  //     }

  //     await this.redis.set(cacheKey, project, PROJECT_TTL);
  //     this.logger.debug(`CACHE SET: ${cacheKey}`);

  //     response.data = { code: 0, data: project };
  //     response.code = HttpStatus.OK;
  //   } catch (error) {
  //     response.data = { code: ErrorCode.INTERNAL_SERVER_ERROR };
  //     response.code = HttpStatus.INTERNAL_SERVER_ERROR;
  //   } finally {
  //     expressResponse(res, response);
  //   }
  // }

  async getProjects(dto: GetProjectDto, req: ICustomRequest, res: Response) {
    const response: IResponse = { code: HttpStatus.ACCEPTED, data: null };

    try {
      const { id } = extractUser(req, dto) as { id: number | null };

      if (!id) {
        response.data = { code: ErrorCode.USER_DOES_NOT_EXIST };
        response.code = HttpStatus.BAD_REQUEST;
        return;
      }

      const cacheKey = projectsByOwnerKey(id);
      const cached = await this.redis.get<Project[]>(cacheKey);

      if (cached) {
        response.data = { code: 0, data: cached };
        response.code = HttpStatus.OK;
        return;
      }

      const projects = await this.projectRepo.find({
        where: { owner_id: id },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          start_date: true,
          end_date: true,
          created_at: true,
          updated_at: true,
        },
      });

      await this.redis.set(cacheKey, projects, PROJECT_TTL);
      this.logger.debug(`CACHE SET: ${cacheKey}`);

      response.data = { code: 0, data: projects };
      response.code = HttpStatus.OK;
    } catch (error) {
      response.data = { code: ErrorCode.INTERNAL_SERVER_ERROR };
      response.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      expressResponse(res, response);
    }
  }

  async createProject(
    dto: CreateProjectDto,
    req: ICustomRequest,
    res: Response,
  ) {
    const response: IResponse = { code: HttpStatus.ACCEPTED, data: null };

    try {
      const { id } = extractUser(req, dto);

      if (!id) {
        response.data = { code: ErrorCode.USER_DOES_NOT_EXIST };
        response.code = HttpStatus.BAD_REQUEST;
        return;
      }

      const s_d = dto.start_date ? parseToDatabaseDate(dto.start_date) : null;
      const e_d = dto.end_date ? parseToDatabaseDate(dto.end_date) : null;

      if (dto.start_date && !s_d) {
        response.data = { code: ErrorCode.DTO_VALIDATION_ERROR };
        response.code = HttpStatus.BAD_REQUEST;
        return;
      }

      if (dto.end_date && !e_d) {
        response.data = { code: ErrorCode.DTO_VALIDATION_ERROR };
        response.code = HttpStatus.BAD_REQUEST;
        return;
      }

      const project: Partial<Project> = {
        title: dto.title,
        description: dto.description,
        start_date: s_d ?? undefined,
        end_date: e_d ?? undefined,
        owner_id: id,
      };

      await this.projectRepo.save(project);
      await this.redis.del(projectsByOwnerKey(id));

      response.data = { code: 0, data: project };
      response.code = HttpStatus.CREATED;
    } catch (error) {
      response.data = { code: ErrorCode.INTERNAL_SERVER_ERROR };
      response.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      expressResponse(res, response);
    }
  }

  async updateProject(
    dto: UpdateProjectDto,
    req: ICustomRequest,
    res: Response,
  ) {
    const response: IResponse = { code: HttpStatus.ACCEPTED, data: null };

    try {
      const { id: userId } = extractUser(req);

      if (!userId) {
        response.data = { code: ErrorCode.USER_DOES_NOT_EXIST };
        response.code = HttpStatus.BAD_REQUEST;
        return;
      }

      if (!dto.id) {
        response.data = { code: ErrorCode.DTO_VALIDATION_ERROR };
        response.code = HttpStatus.BAD_REQUEST;
        return;
      }

      const project = await this.projectRepo.findOne({
        where: { id: dto.id, owner_id: userId },
      });

      if (!project) {
        response.data = { code: ErrorCode.PROJECT_NOT_FOUND };
        response.code = HttpStatus.NOT_FOUND;
        return;
      }

      const entry: Partial<Project> = {};

      if (dto.title !== undefined) entry.title = dto.title;
      if (dto.description !== undefined)
        entry.description = dto.description.trim();
      if (dto.status !== undefined) entry.status = dto.status;

      if (dto.start_date !== undefined) {
        const s_d = parseToDatabaseDate(dto.start_date);
        if (!s_d) {
          response.data = { code: ErrorCode.INVALID_DATE_FORMAT };
          response.code = HttpStatus.BAD_REQUEST;
          return;
        }
        entry.start_date = s_d;
      }

      if (dto.end_date !== undefined) {
        const e_d = parseToDatabaseDate(dto.end_date);
        if (!e_d) {
          response.data = { code: ErrorCode.INVALID_DATE_FORMAT };
          response.code = HttpStatus.BAD_REQUEST;
          return;
        }
        entry.end_date = e_d;
      }

      await this.projectRepo.update({ id: dto.id }, entry);
      await this.redis.del(projectKey(dto.id));
      await this.redis.del(projectsByOwnerKey(userId));

      response.data = { code: 0, data: entry };
      response.code = HttpStatus.OK;
    } catch (error) {
      response.data = { code: ErrorCode.INTERNAL_SERVER_ERROR };
      response.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      expressResponse(res, response);
    }
  }
}
