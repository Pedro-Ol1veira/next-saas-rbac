import { api } from "./api-client";

interface UpdateOrganizationRequest {
    org: string;
    name: string;
    domain: string | null;
    shouldAttachUserByDomain: boolean;
}


export async function updateOrganization({ name, domain, shouldAttachUserByDomain, org }: UpdateOrganizationRequest): Promise<void> {
    
    await api.put(`organization/${org}`, {
        json: {
            domain,
            name,
            shouldAttachUserByDomain
        }
    });


}