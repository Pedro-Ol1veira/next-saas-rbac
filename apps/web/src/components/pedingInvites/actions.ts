"use server";

import { acceptInvite } from "@/http/acceptInvite";
import { rejectInvite } from "@/http/rejectInvite";
import { updateTag } from "next/cache";

export async function acceptInviteAction(inviteId: string) {
    await acceptInvite(inviteId);

    updateTag('organizations');
}

export async function rejectInviteAction(inviteId: string) {
    await rejectInvite(inviteId);

    updateTag('organizations');
}