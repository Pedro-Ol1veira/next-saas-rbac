
import { api } from "./api-client";

interface GetProjectsResponse {
    projects: {
        name: string;
        id: string;
        slug: string;
        avatarUrl: string | null;
        ownerId: string;
        organizationId: string;
        description: string;
        createdAt: string;
        owner: {
            name: string | null;
            id: string;
            avatarUrl: string | null;
        };
    }[]
}

export async function getProjects(org: string) {
    
    const res = await api.get(`organization/${org}/projects`).json<GetProjectsResponse>();
    
    return res;
}