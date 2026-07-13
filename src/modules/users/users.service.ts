/*
https://docs.nestjs.com/providers#services
*/

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { GetUsersDto } from 'src/common/dtos/auth-credentials.dto';
import { User } from 'src/common/entities/user.entity';
import { NotFoundException } from 'src/exceptions/exception';
import { ICustomRequest, IResponse } from 'src/utils/common.interface';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { expressResponse, extractUser } from 'src/utils/common.helper';
import { userKey, usersKey } from 'src/common/redis/redis.keys';
import { ErrorCode } from 'src/common/enums/enum';
import { RedisCacheService } from 'src/common/redis/redis-cach.service';
import { USER_TTL } from 'src/common/redis/redis.ttl';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'main_repo')
    private readonly userRepo: Repository<User>,
    private readonly redis: RedisCacheService,
  ) {}

  async users(dto: GetUsersDto, req: ICustomRequest, res: Response) {
    const response: IResponse = { code: HttpStatus.ACCEPTED, data: null };

    try {
      const { id } = extractUser(req, dto);

      if (!id) {
        response.data = { code: ErrorCode.USER_DOES_NOT_EXIST };
        response.code = HttpStatus.BAD_REQUEST;
        expressResponse(res, response);
        return;
      }

      const cacheKey = usersKey();
      const cached = await this.redis.get<User[]>(cacheKey);

      if (cached) {
        response.data = { code: 0, data: cached };
        response.code = HttpStatus.OK;
        return;
      }

      const users = await this.userRepo.find();

      await this.redis.set(cacheKey, users, USER_TTL);

      response.data = { code: 0, data: users };
      response.code = HttpStatus.OK;
    } catch (error) {
      response.data = { code: ErrorCode.INTERNAL_SERVER_ERROR };
      response.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } finally {
      expressResponse(res, response);
    }
  }

  // async finduser(id: number): Promise<User> {
  //   const user = await this.userRepo.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(id);
  //   }

  //   return user;
  // }

  // async deleteUser(id: number): Promise<void> {
  //   const deleteUser = await this.finduser(id);

  //   await this.userRepo.delete(deleteUser.id);
  // }
}
