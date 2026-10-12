import { User } from "../../prisma/generated/prisma/client";
import { BadRequestError } from "@/http/routes/_errors/badRequestError";
import { UserRepository } from "@/repositories/userRepository";

interface GetProfileUseCaseRequest {
    userId: string;
}


export class GetProfileUseCase {
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute({ userId }: GetProfileUseCaseRequest): Promise<User> {
        const user = await this.userRepository.findUserById(userId);

        if (!user) {
            throw new BadRequestError("User not found");
        }

        return user;
    }
}