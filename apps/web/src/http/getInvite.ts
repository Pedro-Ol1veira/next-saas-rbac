
import { Role } from "@saas/auth";
import { api } from "./api-client";

interface GetInviteResponse {
    invite: {
        id: string;
        email: string;
        role: Role;
        createdAt: string;
        organizationId: string;
        author: {
            id: string;
            name: string | null;
            avatarUrl: string | null;
        } | null;
        organization: {
            name: string;
        };
    }
}

export async function getInvite(inviteId: string) {
    
    const res = await api.get(`invites/${inviteId}`).json<GetInviteResponse>();
    
    return res;
}