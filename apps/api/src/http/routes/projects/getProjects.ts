import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";

export function getProjects(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:orgSlug/projects', {
        schema: {
            tags: ['project'],
            summary: 'Get all organization projects',
            security: [{ bearerAuth: [] }],
            params: z.object({
                orgSlug: z.string(),
            }),
            response: {
                200: z.object({
                    projects: z.array(
                        z.object({
                            name: z.string(),
                            id: z.string(),
                            slug: z.string(),
                            avatarUrl: z.string().nullable(),
                            ownerId: z.string(),
                            organizationId: z.string(),
                            description: z.string(),
                            createdAt: z.date(),
                            owner: z.object({
                                name: z.string().nullable(),
                                id: z.string(),
                                avatarUrl: z.string().nullable(),
                            })
                        })
                    )
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { orgSlug } = request.params;
        const { memberShip, organization } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('get', 'Project')) throw new UnauthorizedError("You do not have permission to get all organization projects.");

        const projects = await prisma.project.findMany({
            where: {
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
                createdAt: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return reply.status(200).send({ projects });
    });
}