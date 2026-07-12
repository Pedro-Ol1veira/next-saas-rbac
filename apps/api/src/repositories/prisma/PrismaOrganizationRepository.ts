import { Organization } from "@/generated/prisma/client";
import { OrganizationRepository } from "../organizationRepository";
import { prisma } from "@/lib/prisma";

export class PrismaOrganizationRepository implements OrganizationRepository {
    async findOrganizationByDomainWithAutoAttachOrganization(domain: string): Promise<Organization | null> {
        const organization = await prisma.organization.findFirst({
            where: {
                domain,
                shouldAttachUserByDomain: true,
            }
        });

        if(!organization) return null;

        return organization;
    }

}