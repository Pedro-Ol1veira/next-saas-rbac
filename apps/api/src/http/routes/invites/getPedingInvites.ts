import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { auth } from "@/http/middlewares/auth";
import { roleSchema } from "@saas/auth/src/roles";

export function getPedingInvites(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/peding-invites', {
        schema: {
            tags: ['invite'],
            summary: 'Get peding invites',
            response: {
                200: z.object({
                    invites: z.array(
                        z.object({
                            id: z.uuid(),
                            email: z.email(),
                            role: roleSchema,
                            createdAt: z.date(),
                            organizationId: z.uuid(),
                            author: z.object({
                                id: z.uuid(),
                                name: z.string().nullable(),
                                avatarUrl: z.url().nullable(),
                            }).nullable(),
                            organization: z.object({
                                name: z.string(),
                            }),
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
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) throw new Error("User not found");
        
        const invites = await prisma.invite.findMany({
            where: {
                email: user.email,
            },
            select: {
                id: true,
                email: true,
                role: true,
                organizationId: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                },
                organization: {
                    select: {
                        name: true,
                    }
                },
            }
        });
        
        return reply.status(200).send({ invites });

    });
}