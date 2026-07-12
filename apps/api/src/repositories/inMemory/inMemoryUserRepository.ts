import { Organization, User } from "@/generated/prisma/client";
import { UserRepository } from "../userRepository";
import { UserCreateInput } from "@/generated/prisma/models/User";
import { hash } from "bcryptjs";
import { MemberRepository } from "../memberRepository";

export class InMemoryUserRepository implements UserRepository {

    public users: User[] = [];
    constructor(
        private memberRepository: MemberRepository
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        const user = this.users.find(user => user.email === email);
        if(!user) return null;
        
        return user;
    }
    
    async create(data: UserCreateInput, autoJoinOrganization: Organization | null): Promise<void> {

        const passwordHash = data.passwordHash ? await hash(data.passwordHash, 6) : await hash('123456', 6);
        
        const user: User = {
            id: data.id || crypto.randomUUID(),
            name: data.name ?? '',
            email: data.email,
            passwordHash,
            avatarUrl: data.avatarUrl ?? null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if(autoJoinOrganization) {
            await this.memberRepository.createMember(user.id, autoJoinOrganization.id);
        }



        this.users.push(user);
    }
}