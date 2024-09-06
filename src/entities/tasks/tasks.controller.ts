import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Res() response: Response) {
    return response.status(200).json(await this.tasksService.findAll());
  }
}
