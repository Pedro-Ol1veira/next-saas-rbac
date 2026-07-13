import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "@/http/middlewares/auth";
import { makeGetProfileUseCase } from "@/factories/makeGetProfileUseCase";

export async function getProfile(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get("/profile", {
        schema: {
            tags: ["auth"],
            summary: "Get authenticated user's profile",
            security: [{ bearerAuth: [] }],
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
        const userId = await request.getCurrentUserId();
        
        const useCase = makeGetProfileUseCase();
        
        const user = await useCase.execute({ userId });

        return reply.status(200).send({ user });
    })
}