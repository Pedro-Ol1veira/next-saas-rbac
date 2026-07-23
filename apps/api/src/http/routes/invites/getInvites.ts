import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/badRequestError";

export function getInvites(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug/invites', {
        schema: {
            tags: ['invite'],
            summary: 'Get all organization invites',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                200: z.object({
                    invites: z.array(z.object({
                        id: z.uuid(),
                        email: z.email(),
                        role: roleSchema,
                        createdAt: z.date(),
                        author: z.object({
                            id: z.uuid(),
                            name: z.string().nullable(),
                        }).nullable(),
                    })),
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

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('get', 'Invite')) throw new UnauthorizedError("You do not have permission to get organizations invites.");

        const invites = await prisma.invite.findMany({
            where: {
                organizationId: organization.id,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return reply.status(200).send({ invites });

    });
}