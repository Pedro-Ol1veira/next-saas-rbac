import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { string, z } from "zod";
import { BadRequestError } from "../_errors/badRequestError";
import { env } from "@saas/env";

export async function authenticateWithGithub(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/sessions/github", {
        schema: {
            tags: ["auth"],
            summary: "Authenticate with Github",
            body: z.object({
                code: z.string(),
            }),
            response: {
                201: z.object({
                    token: z.string().describe("JWT token for authenticated user"),
                })
            }
        },
    }, async (request, reply) => {
        const { code } = request.body;

        const gitgubOAuthUrl = new URL('https://github.com/login/oauth/access_token');
        gitgubOAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
        gitgubOAuthUrl.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET);
        gitgubOAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI);
        gitgubOAuthUrl.searchParams.set('code', code);

        const githubAccessTokenResponse = await fetch(gitgubOAuthUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });

        const githubAccessTokenData = await githubAccessTokenResponse.json();

        const { access_token: githubAccessToken } = z.object({
            access_token: z.string(),
            token_type: z.string('bearer'),
            scope: z.string(),
        }).parse(githubAccessTokenData);

        const fetchGithubUserResponse = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${githubAccessToken}`,
                'Accept': 'application/json',
            },
        });

        const githubUserData = await fetchGithubUserResponse.json();
        console.log(githubUserData)
        const { id: githubId, avatar_url: avatarUrl, name, email } = z.object({
            id: z.number().int().transform(String),
            avatar_url: z.url(),
            name: z.string().nullable(),
            email: z.email().nullable(),
        }).parse(githubUserData);

        if(email === null) throw new BadRequestError("Email not found in Github profile");

        let user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            user = await prisma.user.create({
                data: {
                    name,   
                    email,
                    avatarUrl,
                }
            });
        }

        let account = await prisma.account.findUnique({
            where: {
                provider_userId: {
                    provider: 'GITHUB',
                    userId: githubId,
                }
            }
        });

        if(!account) {
            account = await prisma.account.create({
                data: {
                    provider: 'GITHUB',
                    providerAccountId: githubId,
                    userId: user.id,
                }
            });
        }

        const token = await reply.jwtSign({ sub: user.id }, { 
            sign: { expiresIn: "7d" }
        });

        return reply.status(201).send({ token });
        
    })
}

// https://github.com/login/oauth/authorize?client_id=Ov23lipeZhDsABasyfuJ&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email