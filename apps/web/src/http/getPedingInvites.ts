
import { Role } from "@saas/auth";
import { api } from "./api-client";

interface GetPedingInvitesResponse {
    invites: {
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
    }[]
}

export async function getPedingInvites() {
    
    const res = await api.get(`peding-invites`).json<GetPedingInvitesResponse>();
    
    return res;
}