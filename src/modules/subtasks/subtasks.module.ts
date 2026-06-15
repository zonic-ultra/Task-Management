import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [SubtasksController],
  providers: [SubtasksService],
})
export class SubtasksModule {}
