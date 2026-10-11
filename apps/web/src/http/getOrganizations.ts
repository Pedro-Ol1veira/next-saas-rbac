
import { api } from "./api-client";

interface GetOrganizationsResponse {
    organization: {
        id: string;
        name: string | null;
        slug: string;
        avatar_url: string | null;
    }[]
}

export async function getOrganizations() {
    
    const res = await api.get('organization', {
        next: {
            tags: ['organizations'],
        }
    }).json<GetOrganizationsResponse>();
    
    return res;
}