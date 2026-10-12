import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/getUserPermisions";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import { Role } from "../../../../prisma/generated/prisma/browser";

export function getMembers(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organization/:orgSlug/members', {
        schema: {
            tags: ['project'],
            summary: 'Get all organization members',
            security: [{ bearerAuth: [] }],
            params: z.object({
                orgSlug: z.string(),
            }),
            response: {
                200: z.object({
                    members: z.array(
                        z.object({
                            userID: z.uuid(),
                            id: z.string(),
                            role: z.enum(Role),
                            name: z.string().nullable(),
                            avatarUrl: z.string().nullable(),
                            email: z.string(),
                        })
                    )
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        }
    }, async (request, reply) => {

        const userId = await request.getCurrentUserId();
        const { orgSlug } = request.params;
        const { memberShip, organization } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, memberShip.role);

        if(cannot('get', 'User')) throw new UnauthorizedError("You do not have permission to get all organization members.");

        const members = await prisma.member.findMany({
            where: {
                organizationId: organization.id,
            },
            select: {
                id: true,
                role: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        id: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: {
                role: 'asc',
            }
        });

        const membersWithRoles = members.map(({user: { id: userID, ...user}, ...member}) => {
            return {
                ...user,
                ...member,
                userID,
            }
        });

        return reply.status(200).send({ members: membersWithRoles });
    }

)};