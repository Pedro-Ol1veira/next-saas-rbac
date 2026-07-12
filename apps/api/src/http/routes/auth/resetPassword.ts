import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/UnauthorizedError";
import { hash } from "bcryptjs";

export async function resetPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/password/reset", {
        schema: {
            tags: ["auth"],
            summary: "Reset user password",
            body: z.object({
                code: z.string().describe("Password recovery code sent to user's email"),
                newPassword: z.string().min(6).describe("New password for the user"),
            }),
            response: {
                204: z.undefined().describe("Password updated successfully"),
            }
        },
    }, async (request, reply) => {
        const { code, newPassword } = request.body;
        
        const tokenFromCode = await prisma.token.findUnique({
            where: { id: code },
        });

        if(!tokenFromCode) throw new UnauthorizedError()

        const passwordHash = await hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: tokenFromCode.userId,
            },
            data: {
                passwordHash,
            }
        });

        return reply.status(204).send();
    })
}