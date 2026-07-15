import { auth } from "@/http/middlewares/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export function getOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug', {
        schema: {
            tags: ['organization'],
            summary: 'Get organization details',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                200: z.object({
                    organization: z.object({
                        name: z.string(),
                        id: z.string(),
                        slug: z.string(),
                        domain: z.string().nullable(),
                        shouldAttachUserByDomain: z.boolean(),
                        avatarUrl: z.url().nullable(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        ownerId: z.uuid(),
                    }),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const { slug } = request.params;
        const { organization } = await request.getUserMembership(slug);

        return reply.status(200).send({ organization });

    });
}