import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";

export function removeMember(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:orgSlug/members/:memberId', {
        schema: {
            tags: ['project'],
            summary: 'Remove a member from organization',
            security: [{ bearerAuth: [] }],
            params: z.object({
                orgSlug: z.string(),
                memberId: z.string().uuid(),
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
        const { orgSlug, memberId } = request.params;
        const { memberShip, organization } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('delete', 'User')) throw new UnauthorizedError("You do not have permission to remove this organization member.");

        await prisma.member.delete({
            where: {
                id: memberId,
                organizationId: organization.id,
            },
        });


        return reply.status(204).send();
    }

)};