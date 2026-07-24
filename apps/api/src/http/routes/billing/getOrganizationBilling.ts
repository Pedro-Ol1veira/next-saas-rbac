import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";

export function getOrganizationBilling(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:slug/billing', {
        schema: {
            tags: ['billing'],
            summary: 'Get billing information for an organization',
            security: [{ bearerAuth: [] }],
            params: z.object({
                slug: z.string(),
            }),
            response: {
                200: z.object({
                    billing: z.object({
                        seats: z.object({
                            amount: z.number(),
                            unit: z.number(),
                            price: z.number(),
                        }),
                        projects: z.object({
                            amount: z.number(),
                            unit: z.number(),
                            price: z.number(),
                        }),
                        total: z.number(),
                    })
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, memberShip } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('get', 'Billing')) throw new UnauthorizedError("You do not have permission to access billing information for this organization.");

        const [ amountOfMembers, amountOfProjects ] = await Promise.all([
            prisma.member.count({
                where: {
                    organizationId: organization.id,
                    role: { not: 'BILLING'},
                }
            }),

            prisma.project.count({
                where: {
                    organizationId: organization.id,
                }
            }),

        ]);
        
        return reply.status(200).send({ 
            billing: {
                seats: {
                    amount: amountOfMembers,
                    unit: 10,
                    price: amountOfMembers * 10,
                },
                projects: {
                    amount: amountOfProjects,
                    unit: 20,
                    price: amountOfProjects * 20,
                },
                total: (amountOfMembers * 10) + (amountOfProjects * 20),
            },
         });

    });
}