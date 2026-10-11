
import { api } from "./api-client";

interface GetInvitesResponse {
    invites: {
        id: string;
        email: string;
        role: "ADMIN" | "MEMBER" | "BILLING";
        createdAt: string;
        author: {
            id: string;
            name: string | null;
        } | null;
    }[]
}

export async function getInvites(org: string) {
    
    const res = await api.get(`organization/${org}/invites`, {
        next: {
            tags: [`${org}/invites`]
        }
    }).json<GetInvitesResponse>();
    
    return res;
}