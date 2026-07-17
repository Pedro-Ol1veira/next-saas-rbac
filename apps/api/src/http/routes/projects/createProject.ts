import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/utils/createSlug";

export function createProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization/:slug/project', {
        schema: {
            tags: ['project'],
            summary: 'Create a new project',
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string().min(1, 'Name is required'),
                description: z.string(),
            }),
            params: z.object({
                slug: z.string(),
            }),
            response: {
                201: z.object({
                    projectId: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { slug } = request.params;
        const { memberShip, organization } = await request.getUserMembership(slug);
        const { name, description } = request.body;

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('create', 'Project')) throw new UnauthorizedError("You do not have permission to create a project in this organization.");

        const project = await prisma.project.create({
            data: {
                name,
                slug: createSlug(name),
                description,
                organizationId: organization.id,
                ownerId: userId,
            }
        });

        return reply.status(201).send({ projectId: project.id });
    });
}