import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/badRequestError";

export function UpdateProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:slug/project/:projectId', {
        schema: {
            tags: ['project'],
            summary: 'Update a project',
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string().optional(),
                description: z.string().optional(),
            }),
            params: z.object({
                slug: z.string(),
                projectId: z.uuid(),
            }),
            response: {
                204: z.undefined(),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { slug, projectId } = request.params;
        const { memberShip, organization } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
                organizationId: organization.id,
            }
        });

        if(!project) throw new BadRequestError("Project not found.");

        const authProject = projectSchema.parse(project);

        if(cannot('update', authProject)) throw new UnauthorizedError("You do not have permission to update this project.");

        const { name, description } = request.body;
        
        await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                name,
                description
            }
        });

        return reply.status(204).send();
    });
}