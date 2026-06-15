import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ProjectMember } from 'src/common/entities/project.meber.entity';
import { Project } from 'src/common/entities/project.entity';
import { User } from 'src/common/entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMember, Project, User], 'main_repo'),
    AuthModule,
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
