import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";

export function updateMember(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:orgSlug/members/:memberId', {
        schema: {
            tags: ['project'],
            summary: 'Update an organization member',
            security: [{ bearerAuth: [] }],
            params: z.object({
                orgSlug: z.string(),
                memberId: z.string().uuid(),
            }),
            body: z.object({
                role: roleSchema,
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
        const { memberShip } = await request.getUserMembership(orgSlug);
        const { role } = request.body;

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('update', 'User')) throw new UnauthorizedError("You do not have permission to update this organization member.");

        await prisma.member.update({
            where: {
                id: memberId,
            },
            data: {
                role,
            },
        });


        return reply.status(204).send();
    }

)};