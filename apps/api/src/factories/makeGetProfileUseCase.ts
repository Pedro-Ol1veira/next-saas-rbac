import { PrismaUserRepository } from "@/repositories/prisma/PrismaUserRepository";
import { GetProfileUseCase } from "@/useCases/getProfileUseCase";

export function makeGetProfileUseCase() {
    const userRepository = new PrismaUserRepository();

    const useCase = new GetProfileUseCase(userRepository);

    return useCase;
}
