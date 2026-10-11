'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role } from "@saas/auth";
import { ComponentProps } from "react";
import { updateMemberAction } from "./actions";

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
    memberId: string;
}

export default function UpdateMemberRoleSelect({memberId, ...props}: UpdateMemberRoleSelectProps) {

    async function updateMemberRole(value: unknown) {
        await updateMemberAction(memberId, value as Role);
    }
    
    return(
        <Select onValueChange={updateMemberRole} {...props}>
            <SelectTrigger className="w-32 h-8">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="BILLING">Billing</SelectItem>
            </SelectContent>
        </Select>
    )
    
}