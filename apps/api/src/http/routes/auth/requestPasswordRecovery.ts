import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function requestPasswordRecovery(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/password/recovery", {
        schema: {
            tags: ["auth"],
            summary: "Request password recovery",
            body: z.object({
                email: z.email().describe("User's email address for password recovery"),
            }),
            response: {
                200: z.undefined().describe("Authenticated user's profile"),
            }
        },
    }, async (request, reply) => {
        const { email } = request.body;
        
        const userFromEmail = await prisma.user.findUnique({
            where: { email },
        });

        if(!userFromEmail) return reply.status(200).send();

        const { id: code } = await prisma.token.create({
            data: {
                type: "PASSWORD_RECOVER",
                userId: userFromEmail.id,
            }
        });

        console.log(`Password recovery code for ${email}: ${code}`);
        
        return reply.status(200).send();
    })
}