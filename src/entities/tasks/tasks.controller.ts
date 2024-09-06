import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../../dtos/tasks/create-task.dto';
import { UpdateTaskDto } from '../../dtos/tasks/update-task.dto';

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

  @Patch(':id/status')
  async updateStatus(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() payload: UpdateTaskDto,
  ) {
    const { status } = payload;
    const task = await this.tasksService.updateStatus(id, status);
    return response.status(200).json(task);
  }
}
