import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/badRequestError";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/profile", {
        schema: {
            tags: ["auth"],
            summary: "Get authenticated user's profile",
            response: {
                200: z.object({
                    user: z.object({
                        id: z.string(),
                        name: z.string().nullable(),
                        email: z.email(),
                        avatarUrl: z.url().nullable(),
                    })
                }).describe("Authenticated user's profile"),
                401: z.object({
                    message: z.string().describe("Unauthorized access, user not authenticated"),
                }).describe("User is not authenticated"),
            }
        },
    }, async (request, reply) => {
        const { sub } = await request.jwtVerify<{ sub: string }>();
        
        const user = await prisma.user.findUnique({
            where: { id: sub },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
            }
        });

        if(!user) throw new BadRequestError("User not found");

        return reply.status(200).send({ user });
    })
}