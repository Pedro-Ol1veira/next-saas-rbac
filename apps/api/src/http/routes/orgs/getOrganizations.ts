import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { roleSchema } from "@saas/auth";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export function getOrganizations(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization', {
        schema: {
            tags: ['organization'],
            summary: 'Get organizations where user is a member',
            security: [{ bearerAuth: [] }],
            response: {
                200: z.object({
                    organization: z.array(z.object({
                        id: z.uuid(),
                        name: z.string(),
                        slug: z.string(),
                        avatarUrl: z.url().nullable(),
                        role: roleSchema,
                    })),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const organizations = await prisma.organization.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                avatarUrl: true,
                members: {
                    select: {
                        role: true,
                    },
                    where: {
                        userId
                    }
                },
            },
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        });

        const organizationWithUserRole = organizations.map(({members, ...org}) => {
            return {
                ...org,
                role: members[0]?.role || null,
            }
        });


        
        return reply.status(200).send({ organization: organizationWithUserRole });

    });
}