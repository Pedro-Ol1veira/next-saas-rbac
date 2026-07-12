import { Organization } from "@/generated/prisma/client";

export interface OrganizationRepository {
    findOrganizationByDomainWithAutoAttachOrganization(domain: string): Promise<Organization | null>;
}