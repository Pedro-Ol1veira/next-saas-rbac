import { api } from "./api-client";

interface CreateProjectRequest {
    org: string;
    name: string;
    description: string;
}



export async function createProject({ name, description, org }: CreateProjectRequest): Promise<void> {
    
    await api.post(`organization/${org}/project`, {
        json: {
            description,
            name,
        }

    });


}