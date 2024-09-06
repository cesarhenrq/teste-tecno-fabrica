import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/dtos/tasks/create-task.dto';
import { Validate } from 'class-validator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Res() response: Response) {
    return response.status(200).json(await this.tasksService.findAll());
  }

  @Post()
  async create(@Res() response: Response, @Body() payload: CreateTaskDto) {
    const task = await this.tasksService.create(payload);
    return response.status(201).json(task);
  }

  @Delete(':id')
  async delete(@Res() response: Response, @Param('id') id: string) {
    await this.tasksService.delete(id);
    return response.status(200).json({ message: 'Task deleted successfully' });
  }
}
