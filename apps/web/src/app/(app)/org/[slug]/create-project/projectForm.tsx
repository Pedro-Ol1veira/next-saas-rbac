'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/useFormState";
import { createProjectAction } from "./actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { querryClient } from "@/lib/react-query";

export default function ProjectForm() {

    const { slug: org } = useParams<{slug: string }>();
    
    const [{ success, message, errors }, handleAction, isPending] = useFormState(createProjectAction, () => {
        querryClient.invalidateQueries({
            queryKey: [org, 'projects']
        });
    }, {
        success: false,
        message: null,
        errors: null
    });
    
    return(
        <form onSubmit={handleAction} className="space-y-4 p-5">
            { success === false && message && (
                <Alert variant="destructive">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Save project faled!</AlertTitle>
                    <AlertDescription>
                        <p>{message}</p>
                    </AlertDescription>
                </Alert>
            )}

            { success === true && message && (
                <Alert variant="success">
                    <AlertTriangle className="size-4"/>
                    <AlertTitle>Project saved successfully!</AlertTitle>
                    <AlertDescription>
                        <p className="text-sm text-green-400">{message}</p>
                    </AlertDescription>
                </Alert>
            )}
        
            <div className="space-y-1">
                <Label htmlFor="name">Project Name</Label>
                <Input name="name" id="name"/>
                {errors?.properties?.name && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.name.errors[0]}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="description">Project Description</Label>
                <Textarea name="description" id="description"/>
                {errors?.properties?.description && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.description.errors[0]}</p>
                )}
            </div>
        
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    'Save project'
                )}
            </Button>
            
        </form>
    )
}