import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/utils/createSlug";
import { roleSchema } from "@saas/auth";
import { BadRequestError } from "../_errors/badRequestError";

export function createInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/organization/:slug/invites', {
        schema: {
            tags: ['invite'],
            summary: 'Create a new invite',
            security: [{ bearerAuth: [] }],
            body: z.object({
                email: z.email(),
                role: roleSchema,
            }),
            params: z.object({
                slug: z.string(),
            }),
            response: {
                201: z.object({
                    inviteId: z.uuid(),
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
        const { email, role } = request.body;

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('create', 'Invite')) throw new UnauthorizedError("You do not have permission to create a project in this organization.");

        const [, domain ] = email.split('@');

        if(organization.shouldAttachUserByDomain && organization.domain !== domain) throw new BadRequestError(`Users with "${domain}" will join your organizations automatically on login`)
       
        const inviteWithSameEmail = await prisma.invite.findUnique({
            where: {
                email_organizationId: {
                    email,
                    organizationId: organization.id,
                }
            }
        });

        if(inviteWithSameEmail) throw new BadRequestError(`An invite with the email "${email}" already exists.`);

        const memberWithSameEmail = await prisma.member.findFirst({
            where: {
                organizationId: organization.id,
                user: {
                    email,
                }
            }
        });

        if(memberWithSameEmail) throw new BadRequestError(`A member with the email "${email}" already exists.`);

        const invite = await prisma.invite.create({
            data: {
                email,
                role,
                organizationId: organization.id,
                userId: userId,
            }
        });

        return reply.status(201).send({ inviteId: invite.id });

    });
}