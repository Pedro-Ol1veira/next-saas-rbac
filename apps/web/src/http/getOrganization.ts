
import { api } from "./api-client";

interface GetOrganizationResponse {
    organization: {
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        shouldAttachUserByDomain: boolean;
        avatarUrl: string | null;
        createdAt: string;
        updatedAt: string;
        ownerId: string;
    }
}

export async function getOrganization(slug: string) {
    
    const res = await api.get(`organization/${slug}`).json<GetOrganizationResponse>();
    
    return res;
}