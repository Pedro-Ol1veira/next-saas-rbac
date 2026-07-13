import { Organization, User } from "@/generated/prisma/client";
import { UserCreateInput } from "@/generated/prisma/models";
import { UserRepository } from "../userRepository";
import { prisma } from "@/lib/prisma";

export class PrismaUserRepository implements UserRepository {
    
    async findUserById(userId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if(!user) return null;

        return user;
    }
    
    async create({ name, email, passwordHash }: UserCreateInput, autoJoinOrganization: Organization | null): Promise<void> {
        await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                member_on: autoJoinOrganization ? { create: { 
                    organizationId: autoJoinOrganization.id,
                 } } : undefined
            }
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const userWithEmail = await prisma.user.findUnique({
            where: { email }
        });

        if(!userWithEmail) return null;
        
        return userWithEmail;
    }

}