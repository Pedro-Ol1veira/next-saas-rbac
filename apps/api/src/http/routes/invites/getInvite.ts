import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/badRequestError";
import { roleSchema } from "@saas/auth";

export function getInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/invites/:inviteId', {
        schema: {
            tags: ['invite'],
            summary: 'Get an invite by ID',
            params: z.object({
                inviteId: z.uuid()
            }),
            response: {
                200: z.object({
                    invite: z.object({
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
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const { inviteId } = request.params;
        
        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId,
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
        
        if(!invite) return new BadRequestError(`Invite with not found.`);
        
        return reply.status(200).send({ invite });

    });
}