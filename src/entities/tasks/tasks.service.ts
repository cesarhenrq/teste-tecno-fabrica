import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './tasks.entity';
import { CreateTaskDto } from '../../dtos/tasks/create-task.dto';
import { StatusEnum } from '../../enums/status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async create(task: CreateTaskDto): Promise<Task> {
    const newTask = this.tasksRepository.create(task);
    return this.tasksRepository.save(newTask);
  }

  async delete(id: string): Promise<void> {
    const taskToDelete = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!taskToDelete) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.tasksRepository.delete(id);
  }

  async updateStatus(id: string, status: StatusEnum): Promise<Task> {
    const taskToUpdate = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!taskToUpdate) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    taskToUpdate.status = status;

    return this.tasksRepository.save(taskToUpdate);
  }
}
