import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { BadRequestError } from "../_errors/badRequestError";

export function getProject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:orgSlug/project/:projectSlug', {
        schema: {
            tags: ['project'],
            summary: 'Get a project',
            security: [{ bearerAuth: [] }],
            params: z.object({
                orgSlug: z.string(),
                projectSlug: z.string(),
            }),
            response: {
                200: z.object({
                    project: z.object({
                        name: z.string(),
                        id: z.string(),
                        slug: z.string(),
                        avatarUrl: z.string().nullable(),
                        ownerId: z.string(),
                        organizationId: z.string(),
                        description: z.string(),
                        owner: {
                            name: z.string().nullable(),
                            id: z.string(),
                            avatarUrl: z.string().nullable(),
                        }
                    }),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { orgSlug, projectSlug } = request.params;
        const { memberShip, organization } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('get', 'Project')) throw new UnauthorizedError("You do not have permission to get this project.");

        const project = await prisma.project.findFirst({
            where: {
                slug: projectSlug,
                organizationId: organization.id,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                ownerId: true,
                avatarUrl: true,
                organizationId: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        if(!project) throw new BadRequestError("Project not found.");

        return reply.status(200).send({ project });
    });
}