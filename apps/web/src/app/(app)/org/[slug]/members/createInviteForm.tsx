'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, UserPlus } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { createProjectAction } from "../create-project/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createInviteAction } from "./actions";

export default function CreateInviteForm() {

    
    const [{ success, message, errors }, handleAction, isPending] = useFormState(createInviteAction);
    
    return(
        <form onSubmit={handleAction} className="space-y-4 p-5">
            { success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Invite project faled!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex items-center gap-2">
                <div className="space-y-1 flex-1">
                    <Input type="email" name="email" id="email" placeholder="john@example.com"/>
                    {errors?.properties?.email && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.email.errors[0]}</p>
                    )}
                </div>

                <Select name="role" defaultValue="MEMBER">
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="BILLING">Billing</SelectItem>
                    </SelectContent>
                </Select>

                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <>
                            <UserPlus className="size-4 mr-2"/>
                            Invite user
                        </>
                    )}
                </Button>
            </div>        
            
        </form>
    )
}