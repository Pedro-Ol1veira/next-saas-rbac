import { PrismaOrganizationRepository } from "@/repositories/prisma/PrismaOrganizationRepository";
import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { CreateAccountUseCase } from "@/useCases/createAccountUseCase";

export function makeCreateAccountUseCase() {
    const userRepository = new PrismaUserRepository();
    const organizationRepository = new PrismaOrganizationRepository();

    const useCase = new CreateAccountUseCase(userRepository, organizationRepository);

    return useCase;
}
