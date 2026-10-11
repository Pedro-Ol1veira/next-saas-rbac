import { api } from "./api-client";
import { Role } from '@saas/auth';

interface GetMembershipResponse {
    membership: {
        id: string;
        userId: string;
        role: Role;
        organizationId: string;
    }
}

export async function getMembership(slug: string) {
    
    const res = await api.get(`/organization/${slug}/membership`).json<GetMembershipResponse>();
    
    return res;
}