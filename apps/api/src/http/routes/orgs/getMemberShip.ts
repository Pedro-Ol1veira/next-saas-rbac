import { auth } from "@/http/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { roleSchema } from '@saas/auth'
import z from "zod";

export async function getMemberShip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug/membership', {
        schema: {
            tags: ['organization'],
            summary: 'Get user membership for an organization',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                200: z.object({
                    membership: z.object({
                        id: z.uuid(),
                        userId: z.uuid(),
                        role: roleSchema,
                        organizationId: z.string(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { slug } = request.params;
        const { memberShip } = await request.getUserMembership(slug);

        return reply.status(200).send({ 
            membership: {
                id: memberShip.id,
                role: memberShip.role,
                organizationId: memberShip.organizationId,
                userId: memberShip.userId,
            }
         });

    })
}