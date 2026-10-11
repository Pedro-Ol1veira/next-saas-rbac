import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../_errors/badRequestError";
import { roleSchema } from "@saas/auth";
import { auth } from "@/http/middlewares/auth";

export function acceptInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/invites/:inviteId/accept', {
        schema: {
            tags: ['invite'],
            summary: 'Accept an invite by',
            params: z.object({
                inviteId: z.uuid()
            }),
            response: {
                204: z.undefined(),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const { inviteId } = request.params;
        const userId = await request.getCurrentUserId();
        
        const invite = await prisma.invite.findUnique({
            where: {
                id: inviteId,
            }
        });

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if(!user) throw new BadRequestError(`User not found.`);

        if(invite?.email !== user.email) throw new BadRequestError(`Invite email does not match user email.`);
        
        if(!invite) return new BadRequestError(`Invite with not found or expired.`);

        await prisma.$transaction([
            prisma.member.create({
                data: {
                    userId,
                    organizationId: invite.organizationId,
                    role: invite.role
                }
            }),

            prisma.invite.delete({
                where: {
                    id: inviteId
                }
            }),
        ]);
        
        return reply.status(204).send();

    });
}