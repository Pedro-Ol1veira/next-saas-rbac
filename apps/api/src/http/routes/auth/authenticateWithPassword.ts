import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/badRequestError";

export async function authenticateWithPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/sessions/password", {
        schema: {
            tags: ["auth"],
            summary: "Authenticate with email and password",
            body: z.object({
                email: z.email(),
                password: z.string().min(6),
            }),
            response: {
                201: z.object({
                    token: z.string().describe("JWT token for authenticated user"),
                })
            }
        },
    }, async (request, reply) => {
        const { email, password } = request.body;

        const userFromEmail = await prisma.user.findUnique({
            where : { email }
        });

        if(!userFromEmail) throw new BadRequestError("User Not Found");
        if(userFromEmail.passwordHash === null) throw new BadRequestError("Invalid credentials");
        
        const isPasswordMatch = await compare(password, userFromEmail.passwordHash);
        if(!isPasswordMatch) throw new BadRequestError("Invalid credentials");


        const token = await reply.jwtSign({ sub: userFromEmail.id }, { 
            sign: { expiresIn: "7d" }
        });

        return reply.status(201).send({ token });
    })
}