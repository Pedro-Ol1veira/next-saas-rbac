import { Organization } from "../../prisma/generated/prisma/client";

export interface OrganizationRepository {
    findOrganizationByDomainWithAutoAttachOrganization(domain: string): Promise<Organization | null>;
}