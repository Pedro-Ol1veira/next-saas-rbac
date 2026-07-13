import { app } from "@/http/server"
import { prisma } from "@/lib/prisma";
import request from "supertest";

describe('[POST] /users', async (t) => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should create a new user', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
        });

        const userOnDb = await prisma.user.findUnique({
            where: {
                email: 'john.doe@example.com'
            }
        });

        expect(response.status).toBe(201);
        expect(userOnDb).toBeTruthy();
    });
})