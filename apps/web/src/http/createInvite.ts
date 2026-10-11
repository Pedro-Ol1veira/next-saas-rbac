import { Role } from "@saas/auth";
import { api } from "./api-client";

interface CreateInviteRequest {
    org: string;
    email: string;
    role: Role;
}



export async function createInvite({ email, org, role }: CreateInviteRequest): Promise<void> {
    
    await api.post(`organization/${org}/invites`, {
        json: {
            email,
            role,
        }

    });


}