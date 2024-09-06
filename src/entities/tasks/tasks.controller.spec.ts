import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../../dtos/tasks/create-task.dto';
import { UpdateTaskDto } from '../../dtos/tasks/update-task.dto';
import { Response } from 'express';
import { NotFoundException } from '@nestjs/common';
import { StatusEnum } from '../../enums/status.enum';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    const mockTasksService = {
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of tasks', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test',
          status: StatusEnum.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      jest.spyOn(tasksService, 'findAll').mockResolvedValue(tasks);

      await controller.findAll(mockResponse as Response);

      expect(tasksService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(tasks);
    });
  });

  describe('create', () => {
    it('should create a new task and return it', async () => {
      const payload: CreateTaskDto = { title: 'New Task', description: 'Test' };
      const createdTask = {
        id: '1',
        ...payload,
        status: StatusEnum.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest.spyOn(tasksService, 'create').mockResolvedValue(createdTask);

      await controller.create(mockResponse as Response, payload);

      expect(tasksService.create).toHaveBeenCalledWith(payload);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTask);
    });
  });

  describe('delete', () => {
    it('should delete a task and return a success message', async () => {
      const taskId = '1';
      jest.spyOn(tasksService, 'delete').mockResolvedValue(undefined);

      await controller.delete(mockResponse as Response, taskId);

      expect(tasksService.delete).toHaveBeenCalledWith(taskId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Task deleted successfully',
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      const taskId = '1';
      jest
        .spyOn(tasksService, 'delete')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.delete(mockResponse as Response, taskId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update task status and return the updated task', async () => {
      const taskId = '1';
      const payload: UpdateTaskDto = { status: StatusEnum.DONE };
      const updatedTask = {
        id: taskId,
        status: payload.status,
        title: 'Test Task',
        description: 'Test',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jest.spyOn(tasksService, 'updateStatus').mockResolvedValue(updatedTask);

      await controller.updateStatus(mockResponse as Response, taskId, payload);

      expect(tasksService.updateStatus).toHaveBeenCalledWith(
        taskId,
        payload.status,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedTask);
    });
  });
});
