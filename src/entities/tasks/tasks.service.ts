import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tasks } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
  ) {}

  async findAll(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }
}
