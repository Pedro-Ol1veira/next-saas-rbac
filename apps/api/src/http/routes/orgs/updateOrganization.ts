import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { organizationSchema } from '@saas/auth';
import z from "zod";
import { BadRequestError } from "../_errors/badRequestError";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { getUserPermissions } from "@/utils/getUserPermisions";

export function updateOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).put('/organization/:id', {
        schema: {
            tags: ['organization'],
            summary: 'Update an existing organization',
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string().min(1, 'Name is required'),
                domain: z.string().nullish(),
                shouldAttachUserByDomain: z.boolean().optional(),
            }),
            params: z.object({
                id: z.string(),
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
        const { id: slug } = request.params;
        const { memberShip, organization } = await request.getUserMembership(slug);
        const { name, domain, shouldAttachUserByDomain } = request.body;

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('update', authOrganization)) throw new UnauthorizedError("You do not have permission to update this organization.");

        
        if(domain) {
            const organizationByDomain = await prisma.organization.findFirst({
                where: { 
                    domain,
                    id: { 
                        not: organization.id
                    }
                 }
            });

            if(organizationByDomain) throw new BadRequestError("An organization with this domain already exists.");
        }

        await prisma.organization.update({
            where: { 
                id: organization.id
            },
            data: {
                name,
                domain,
                shouldAttachUserByDomain,
            }
        });

        return reply.status(204).send();

    });
}