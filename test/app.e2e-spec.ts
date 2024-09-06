import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateTaskDto } from '../src/dtos/tasks/create-task.dto';
import { UpdateTaskDto } from '../src/dtos/tasks/update-task.dto';
import { StatusEnum } from '../src/enums/status.enum';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/tasks (GET)', () => {
    it('should return an array of tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Task description',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createTaskDto.title);
      expect(response.body.description).toBe(createTaskDto.description);
      expect(response.body.status).toBe(StatusEnum.PENDING);
    });

    it('should return 400 if title is not provided', async () => {
      const createTaskDto = {
        description: 'Task description',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(400);
    });

    it('should return 400 if description is not provided', async () => {
      const createTaskDto = {
        title: 'Test Task',
      };

      await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(400);
    });
  });

  describe('/tasks/:id/status (PATCH)', () => {
    it('should update the status of a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Task to update status',
        description: 'Task description',
      };

      const { body: createdTask } = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      const updateTaskDto: UpdateTaskDto = { status: StatusEnum.DONE };

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createdTask.id}/status`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body.id).toBe(createdTask.id);
      expect(response.body.status).toBe(StatusEnum.DONE);
    });

    const invalidStatuses = ['INVALID', ''];

    invalidStatuses.forEach((status) => {
      it(`should return 400 if status is not a valid enum value (${status})`, async () => {
        const createTaskDto: CreateTaskDto = {
          title: 'Task to update status',
          description: 'Task description',
        };

        const { body: createdTask } = await request(app.getHttpServer())
          .post('/tasks')
          .send(createTaskDto)
          .expect(201);

        const updateTaskDto = { status };

        await request(app.getHttpServer())
          .patch(`/tasks/${createdTask.id}/status`)
          .send(updateTaskDto)
          .expect(400);
      });
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Task to delete',
        description: 'Task description',
      };

      const { body: createdTask } = await request(app.getHttpServer())
        .post('/tasks')
        .send(createTaskDto)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/tasks/${createdTask.id}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/tasks/${createdTask.id}`)
        .expect(404);
    });
  });
});
