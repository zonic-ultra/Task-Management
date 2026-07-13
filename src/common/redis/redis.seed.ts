// import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import Redis from 'ioredis';
// import { Repository } from 'typeorm';
// import { REDIS_CLIENT } from './redis-con.module';
// import { User } from '../entities/user.entity';
// import { Project } from '../entities/project.entity';
// import { Tasks } from '../entities/task.entity';
// import {
//   sampleCountsKey,
//   sampleDateKey,
//   sampleLatestTaskKey,
// } from './redis.keys';

// @Injectable()
// export class RedisSeeds implements OnApplicationBootstrap {
//   constructor(
//     @Inject(REDIS_CLIENT) private readonly redis: Redis,
//     @InjectRepository(User, 'main_repo')
//     private readonly userRepo: Repository<User>,
//     @InjectRepository(Project, 'main_repo')
//     private readonly projectRepo: Repository<Project>,
//     @InjectRepository(Tasks, 'main_repo')
//     private readonly taskRepo: Repository<Tasks>,
//   ) {}

//   async onApplicationBootstrap() {
//     await this.seedSampleData();
//   }

//   async seedSampleData() {
//     try {
//       const sampleDate = new Date().toISOString();
//       await this.redis.set(sampleDateKey(), sampleDate);

//       const [userCount, projectCount, taskCount] = await Promise.all([
//         this.userRepo.count(),
//         this.projectRepo.count(),
//         this.taskRepo.count(),
//       ]);

//       await this.redis.hset(sampleCountsKey(), {
//         users: userCount.toString(),
//         projects: projectCount.toString(),
//         tasks: taskCount.toString(),
//       });

//       const latestTask = await this.taskRepo.findOne({
//         order: { created_at: 'DESC' },
//         select: [
//           'id',
//           'title',
//           'status',
//           'priority',
//           'project_id',
//           'assignee_id',
//           'created_by',
//           'due_date',
//           'created_at',
//         ],
//       });

//       if (latestTask) {
//         await this.redis.set(sampleLatestTaskKey(), JSON.stringify(latestTask));
//       }
//     } catch (error) {
//       console.error('Redis sample data seed error:', error);
//     }
//   }
// }
