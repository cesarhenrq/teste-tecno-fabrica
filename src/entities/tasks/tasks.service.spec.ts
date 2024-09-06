import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { CreateTaskDto } from '../../dtos/tasks/create-task.dto';
import { StatusEnum } from '../../enums/status.enum';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<Task>>;

  const mockTaskRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(
      getRepositoryToken(Task),
    ) as jest.Mocked<Repository<Task>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          status: StatusEnum.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      repository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task Description',
      };
      const createdTask = {
        id: '1',
        ...createTaskDto,
        status: StatusEnum.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      repository.create.mockReturnValue(createdTask);
      repository.save.mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto);

      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
      expect(repository.save).toHaveBeenCalledWith(createdTask);
      expect(result).toEqual(createdTask);
    });
  });

  describe('delete', () => {
    it('should delete a task successfully', async () => {
      const taskId = '1';
      const taskToDelete = {
        id: taskId,
        title: 'Task to delete',
        description: 'Task description',
        status: StatusEnum.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      repository.findOne.mockResolvedValue(taskToDelete);
      repository.delete.mockResolvedValue(undefined);

      await service.delete(taskId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(repository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = '2';

      repository.findOne.mockResolvedValue(null);

      await expect(service.delete(taskId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update the task status successfully', async () => {
      const taskId = '1';
      const status = StatusEnum.DONE;
      const taskToUpdate = {
        id: taskId,
        title: 'Task to update',
        description: 'Task description',
        status: StatusEnum.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      repository.findOne.mockResolvedValue(taskToUpdate);
      repository.save.mockResolvedValue({ ...taskToUpdate, status });

      const result = await service.updateStatus(taskId, status);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(repository.save).toHaveBeenCalledWith({ ...taskToUpdate, status });
      expect(result.status).toEqual(status);
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = '3';
      const status = StatusEnum.DONE;

      repository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(taskId, status)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
