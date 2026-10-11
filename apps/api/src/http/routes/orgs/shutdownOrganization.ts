import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { organizationSchema } from '@saas/auth';
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { getUserPermissions } from "@/utils/getUserPermisions";

export function shutdownOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/organization/:slug', {
        schema: {
            tags: ['organization'],
            summary: 'Shutdown an existing organization',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                204: z.undefined(),
                401: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { slug } = request.params;
        const { memberShip, organization } = await request.getUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('delete', authOrganization)) throw new UnauthorizedError("You do not have permission to shutdown this organization.");


        await prisma.organization.delete({
            where: { 
                id: organization.id
            }
        });

        return reply.status(204).send();

    });
}