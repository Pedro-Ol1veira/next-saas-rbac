import { Member } from "../../../prisma/generated/prisma/client";
import { MemberRepository } from "../memberRepository";
import { MemberCreateInput } from "../../../prisma/generated/prisma/models/Member";

export class InMemoryMemberRepository implements MemberRepository {
    public members: Member[] = [];

    async createMember(userId: string, organizationId: string): Promise<void> {
        const member: Member = {
            id: crypto.randomUUID(),
            organizationId: organizationId ?? '',
            userId: userId ?? '',
            role: 'MEMBER',
        };

        this.members.push(member);
    }
}