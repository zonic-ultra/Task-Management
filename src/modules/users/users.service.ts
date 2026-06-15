/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { User } from 'src/common/entities/user.entity';
import { NotFoundException } from 'src/exceptions/exception';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'main_repo')
    private readonly userRepo: Repository<User>,
  ) {}

  async users(): Promise<User[]> {
    const users = this.userRepo.find();

    return users;
  }

  async finduser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(id);
    }

    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const deleteUser = await this.finduser(id);

    await this.userRepo.delete(deleteUser.id);
  }
}
