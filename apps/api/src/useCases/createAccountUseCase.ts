import { BadRequestError } from "@/http/routes/_errors/badRequestError";
import { OrganizationRepository } from "@/repositories/organizationRepository";
import { UserRepository } from "@/repositories/userRepository";
import { hash } from "bcryptjs";

interface CreateAccountUseCaseRequest {
    name: string;
    email: string;
    password: string;
}


export class CreateAccountUseCase {
    constructor(
        private userRepository: UserRepository,
        private organizationRepository: OrganizationRepository
    ) {}

    async execute({ name, email, password }: CreateAccountUseCaseRequest): Promise<void> {
        const userWithEmail = await this.userRepository.findUserByEmail(email);

        if(userWithEmail) throw new BadRequestError("User with this email already exists");

        const [, domain] = email.split('@');
        const autoJoinOrganization = await this.organizationRepository.findOrganizationByDomainWithAutoAttachOrganization(domain);

        const passwordHash = await hash(password, 6);
        
        await this.userRepository.create({
            name,
            email,
            passwordHash,
        }, autoJoinOrganization);

    }
}