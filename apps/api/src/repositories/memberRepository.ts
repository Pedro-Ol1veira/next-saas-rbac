
export interface MemberRepository {
    createMember(userId: string, organizationId: string): Promise<void>;
}