import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { BadRequestError } from "../_errors/badRequestError";

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
                    error: z.string()
                }).describe('User account creation failed due to validation errors or existing email')
            }
        }
    },async (request, reply) => {
        const { name, email, password } = request.body;

        const userWithEmail = await prisma.user.findUnique({
            where: { email }
        });

        if(userWithEmail) throw new BadRequestError("User with this email already exists");

        const [, domain] = email.split('@');
        const autoJoinOrganization = await prisma.organization.findFirst({
            where: { 
                domain,
                shouldAttachUserByDomain: true
            }
        });

        const passwordHash = await hash(password, 6);
        
        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                member_on: autoJoinOrganization ? { create: { 
                    organizationId: autoJoinOrganization.id,
                 } } : undefined
            }
        });

        return reply.status(201).send();
        
    });
}