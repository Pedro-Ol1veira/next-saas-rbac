import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import be from "zod/v4/locales/be.js";
import { BadRequestError } from "../_errors/badRequestError";
import { createSlug } from "@/utils/createSlug";

export function createOrganization(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization', {
        schema: {
            tags: ['organization'],
            summary: 'Create a new organization',
            security: [{ bearerAuth: [] }],
            body: z.object({
                name: z.string().min(1, 'Name is required'),
                domain: z.string().nullish(),
                shouldAttachUserByDomain: z.boolean().optional(),
            }),
            response: {
                201: z.object({
                    organizationId: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { name, domain, shouldAttachUserByDomain } = request.body;

        if(domain) {
            const organizationByDomain = await prisma.organization.findUnique({
                where: { domain }
            })

            if(organizationByDomain) throw new BadRequestError("An organization with this domain already exists.");
        }

        const organization = await prisma.organization.create({
            data: {
                name,
                domain,
                slug: createSlug(name),
                shouldAttachUserByDomain,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'ADMIN'
                    }
                }
            }
        });

        return reply.status(201).send({ organizationId: organization.id });

    });
}