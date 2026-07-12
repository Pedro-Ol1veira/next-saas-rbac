import { Organization, User } from "@/generated/prisma/client";
import { UserCreateInput } from "@/generated/prisma/models";

export interface UserRepository {
    create(data: UserCreateInput, autoJoinOrganization: Organization | null): Promise<void>;
    findUserByEmail(email: string): Promise<User | null>;
}