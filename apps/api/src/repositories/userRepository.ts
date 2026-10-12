import { Organization, User } from "../../prisma/generated/prisma/client";
import { UserCreateInput } from "../../prisma/generated/prisma/models";

export interface UserRepository {
    create(data: UserCreateInput, autoJoinOrganization: Organization | null): Promise<void>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(userId: string): Promise<User | null>;
}