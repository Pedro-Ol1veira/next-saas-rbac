import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { makeCreateAccountUseCase } from "@/factories/makeCreateAccountUseCase";

export async function createAccount(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            tags: ['auth'],
            summary: 'Create a new user account',
            body: z.object({
                name: z.string().min(1, 'Name is required'),
                email: z.email('Invalid email address'),
                password: z.string().min(6, 'Password must be at least 6 characters long')
            }),
            response: {
                201: z.undefined().describe('User account created successfully'),
                400: z.object({
                    message: z.string()
                }).describe('User account creation failed due to validation errors or existing email')
            }
        }
    },async (request, reply) => {
        const { name, email, password } = request.body;

        const useCase = makeCreateAccountUseCase();

        await useCase.execute({ name, email, password });

        
        return reply.status(201).send();
        
    });
}