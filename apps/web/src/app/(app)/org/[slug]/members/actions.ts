'use server';

import { getCurrentOrg } from "@/auth/auth";
import { removeMember } from "@/http/removeMember";
import { revokeInvite } from "@/http/revokeInvite";
import { updateMember } from "@/http/updateMember";
import { Role, roleSchema } from "@saas/auth";
import { updateTag } from "next/cache";
import { z } from "zod";
import { HTTPError } from "ky";
import { createInvite } from "@/http/createInvite";

export async function removeMemberAction(memberId: string) {
    const currentOrg = await getCurrentOrg();

    await removeMember({ org: currentOrg!, memberId });

    updateTag(`${currentOrg}/members`);
}

export async function updateMemberAction(memberId: string, role: Role) {
    const currentOrg = await getCurrentOrg();

    await updateMember({ org: currentOrg!, memberId, role });

    updateTag(`${currentOrg}/members`);
}

export async function revokeInviteAction(inviteId: string) {
    console.log(inviteId);
    const currentOrg = await getCurrentOrg();

    await revokeInvite({ org: currentOrg!, inviteId });

    updateTag(`${currentOrg}/invites`);
}

const inviteSchema = z.object({
    email: z.email('Please enter a valid email address'),
    role: roleSchema
})

export async function createInviteAction(data: FormData) {
    const currentOrg = (await getCurrentOrg())!;

    const result = inviteSchema.safeParse(Object.fromEntries(data));

    if(result.success === false) {

        const errors = z.treeifyError(result.error); 
        return {
            success: false,
            message: null,
            errors
        }
    }
    
    const { email, role } = result.data;

    try {
        await createInvite({
            email, 
            role,
            org: currentOrg
        });
        
        updateTag(`${currentOrg}/invites`);
    } catch (error) {
        if(error instanceof HTTPError) {
            const { message } = await error.data;

            return {
                success: false,
                message: message,
                errors: null
            }
        }

        console.log(error);

        return {
            success: false,
            message: "An unexpected error occurred. Please try again later.",
            errors: null
        }
    }

    return { 
        success: true,
        message: "Successfully created the invite.",
        errors: null
    }

}
