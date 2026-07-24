import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/badRequestError";

export function revokeInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:slug/invites/:inviteId', {
        schema: {
            tags: ['invite'],
            summary: 'Revoke an existing invite',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
                inviteId: z.uuid(),
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
        const { slug, inviteId } = request.params;
        const { memberShip, organization } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('delete', 'Invite')) throw new UnauthorizedError("You do not have permission to delete an invite in this organization.");


        const invite = await prisma.invite.findUnique({
            where: {
                id: request.params.inviteId,
                organizationId: organization.id,
            }
        });

        if(!invite) throw new BadRequestError(`Invite not found or expired.`);

        await prisma.invite.delete({
            where: {
                id: inviteId,
            }
        });
        
        return reply.status(204).send();

    });
}