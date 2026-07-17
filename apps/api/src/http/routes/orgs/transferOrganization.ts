import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { organizationSchema } from '@saas/auth';
import z from "zod";
import { BadRequestError } from "../_errors/badRequestError";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { getUserPermissions } from "@/utils/getUserPermisions";

export function transferOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/organization/:slug/owner', {
        schema: {
            tags: ['organization'],
            summary: 'Transfer an organization to a different user',
            security: [{ bearerAuth: [] }],
            body: z.object({
                transferUserId: z.uuid(),
            }),
            params: z.object({
                slug: z.string(),
            }),
            response: {
                204: z.undefined(),
                401: z.object({
                    message: z.string(),
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
        const { transferUserId } = request.body;

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('transfer_ownership', authOrganization)) throw new UnauthorizedError("You do not have permission to transfer ownership of this organization.");

        const transferToMembership = await prisma.member.findUnique({
            where: {
                userId_organizationId: {
                    organizationId: organization.id,
                    userId: transferUserId
                }
            }
        });

        if(!transferToMembership) throw new BadRequestError("The user you are trying to transfer ownership to is not a member of this organization.");

        await prisma.$transaction([
            prisma.member.update({
                where: {
                    userId_organizationId: {
                        organizationId: organization.id,
                        userId: transferUserId
                    }
                },
                data: {
                    role: 'ADMIN'
                }
            }),

            prisma.organization.update({
                where: { id: organization.id },
                data: {
                    ownerId: transferUserId
                }
            }),
        ])
        
        return reply.status(204).send();

    });
}