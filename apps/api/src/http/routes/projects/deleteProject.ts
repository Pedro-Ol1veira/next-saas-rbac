import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/badRequestError";

export function deleteProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:slug/project/:projectId', {
        schema: {
            tags: ['project'],
            summary: 'Delete a project',
            security: [{ bearerAuth: [] }],
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

        if(cannot('delete', authProject)) throw new UnauthorizedError("You do not have permission to delete this project.");

        await prisma.project.delete({
            where: {
                id: projectId
            }
        });

        return reply.status(204).send();
    });
}