import { Organization } from "@/generated/prisma/client";
import { OrganizationRepository } from "../organizationRepository";

export class InMemoryOrganizationRepository implements OrganizationRepository {
    
    public organizations: Organization[] = [];

    async findOrganizationByDomainWithAutoAttachOrganization(domain: string): Promise<Organization | null> {
        const organization = this.organizations.find(org => org.domain === domain && org.shouldAttachUserByDomain);
        if(!organization) return null;
        
        return organization;
    }
}