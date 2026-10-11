import { getCurrentOrg } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { shutdownOrganization } from "@/http/shutdownOrganization";
import { XCircle } from "lucide-react";
import { redirect } from "next/navigation";

export function ShutdownOrganizationButton() {

    async function handleShutdown() {
        'use server';

        const currentOrg = await getCurrentOrg();
        await shutdownOrganization({ org: currentOrg! });

        redirect('/');
    }
    
    return (
        <form action={handleShutdown}>
            <Button
                variant="destructive"
                className="w-56"
                type="submit"
            >
                <XCircle className="size-4 mr-2"/>
                Shutdown Organization
            </Button>
        </form>
    )
}