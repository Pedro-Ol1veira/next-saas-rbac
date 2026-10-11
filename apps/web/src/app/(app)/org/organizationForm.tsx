'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/useFormState";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { createOrganizationAction, OrganizationSchema, updateOrganizationAction } from "./actions";

interface OrganizationFormProps {
    isUpdating?: boolean;
    inicialData?: OrganizationSchema;
}

export default function OrganizationForm({ isUpdating = false, inicialData }: OrganizationFormProps) {

    const formAction = isUpdating ? updateOrganizationAction : createOrganizationAction;
    const [{ success, message, errors }, handleAction, isPending] = useFormState(formAction);
    
    return(
        <form onSubmit={handleAction} className="space-y-4 p-5">
            { success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Save organization faled!</AlertTitle>
                    <AlertDescription>
                        <p >{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            { success === true && message && (
                <Alert variant="success">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Organization saved successfully!</AlertTitle>
                    <AlertDescription>
                        <p className="text-sm text-green-400">{message}</p>
                    </AlertDescription>
                </Alert>
            )}
        
            <div className="space-y-1">
                <Label htmlFor="name">Organization Name</Label>
                <Input name="name" id="name" defaultValue={inicialData?.name} />
                {errors?.properties?.name && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.name.errors[0]}</p>
                )}
            </div>
        
            <div className="space-y-1">
                <Label htmlFor="domain">E-mail domain</Label>
                <Input name="domain" type="text" id="domain" inputMode="url" placeholder="example.com" defaultValue={inicialData?.domain ?? undefined} />
                {errors?.properties?.domain && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.domain.errors[0]}</p>
                )}
            </div>
            <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                    <Checkbox 
                        name="shouldAttachUsersByDomain" 
                        id="shouldAttachUsersByDomain" 
                        className="translate-y-0.5" 
                        defaultChecked={inicialData?.shouldAttachUserByDomain} 
                    />
                    <label 
                        htmlFor="shouldAttachUsersByDomain"
                        className="space-y-1"
                    >
                        <span className="text-sm font-medium leading-none">
                            Auto-join new members
                        </span>
                        <p className="text-sm text-muted-foreground">
                            This will automatically add new users to the organization based on their email domain.
                        </p>
                    </label>
                </div>
                {errors?.properties?.shouldAttachUsersByDomain && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.shouldAttachUsersByDomain.errors[0]}</p>
                )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Save organization'
                )}
            </Button>
            
        </form>
    )
}