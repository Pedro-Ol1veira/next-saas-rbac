import { api } from "./api-client";

interface CreateOrganizationRequest {
    name: string;
    domain: string | null;
    shouldAttachUserByDomain: boolean;
}


export async function createOrganization({ name, domain, shouldAttachUserByDomain  }: CreateOrganizationRequest): Promise<void> {
    
    await api.post('organization', {
        json: {
            domain,
            name,
            shouldAttachUserByDomain
        }

    });


}