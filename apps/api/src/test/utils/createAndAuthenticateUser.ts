import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(app: FastifyInstance){
    
  await prisma.user.create({
    data: {
      name: 'teste',
      email: 'teste@exemple.com',
      passwordHash: await hash('123456', 6),
    }
  })

    const authResponse = await request(app.server).post("/sessions/password").send({
      email: "teste@exemple.com",
      password: "123456",
    });

    const { token } = authResponse.body;

    return { token };
}