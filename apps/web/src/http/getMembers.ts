
import { Role } from "@saas/auth";
import { api } from "./api-client";

interface GetMembersResponse {
    members: {
        userID: string;
        id: string;
        role: Role;
        name: string | null;
        avatarUrl: string | null;
        email: string;
    }[];
}

export async function getMembers(org: string) {
    
    const res = await api.get(`organization/${org}/members`, {
        next: {
            tags: [`${org}/members`],
        }
    }).json<GetMembersResponse>();
    
    return res;
}