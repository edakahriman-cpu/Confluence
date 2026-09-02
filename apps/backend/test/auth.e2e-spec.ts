import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = moduleFixture.get(PrismaService);
    await prisma.user.deleteMany();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should register a user and return a JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'demo-user', password: '12345' })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user).toMatchObject({
      username: 'demo-user',
      isActive: true,
      isDeleted: false,
    });
  });

  it('should reject weak passwords on register', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'demo-user', password: '1234' })
      .expect(400);
  });

  it('should login with username and password', async () => {
    await prisma.user.create({
      data: {
        username: 'demo-user',
        password: '$2a$10$wT/eR2I7fH8Qv0s2jT7rNOMlT0li.7Z8nX6vIQA0p3fD2mE0lf7b2',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'demo-user', password: 'secret123' })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.user.username).toBe('demo-user');
  });

  it('should reject invalid login credentials', async () => {
    await prisma.user.create({
      data: {
        username: 'demo-user',
        password: '$2a$10$wT/eR2I7fH8Qv0s2jT7rNOMlT0li.7Z8nX6vIQA0p3fD2mE0lf7b2',
      },
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'demo-user', password: 'wrongpass' })
      .expect(401);
  });

  it('should accept forgot-password request for existing user', async () => {
    await prisma.user.create({
      data: {
        username: 'demo-user',
        password: '$2a$10$wT/eR2I7fH8Qv0s2jT7rNOMlT0li.7Z8nX6vIQA0p3fD2mE0lf7b2',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ username: 'demo-user' })
      .expect(201);

    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('resetToken');
  });

  it('should return current user from protected route when JWT is valid', async () => {
    const created = await prisma.user.create({
      data: {
        username: 'demo-user',
        password: '$2a$10$wT/eR2I7fH8Qv0s2jT7rNOMlT0li.7Z8nX6vIQA0p3fD2mE0lf7b2',
      },
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'demo-user', password: 'secret123' })
      .expect(201);

    const profileResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    expect(profileResponse.body.sub).toBe(created.id);
    expect(profileResponse.body.username).toBe('demo-user');
  });
});
