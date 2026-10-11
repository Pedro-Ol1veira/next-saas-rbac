'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import githubIcon from "@/../public/githubIcon.svg";
import { useFormState } from "@/hooks/useFormState";
import { signUpAction } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signInWithGitHub } from "../actions";
import Link from "next/link";

export function SignUpForm() {

    const [{ success, message, errors }, handleAction, isPending] = useFormState(signUpAction, {
        success: false,
        message: null,
        errors: null
    });
    
    return (
        <div className="space-y-4">
            <form onSubmit={handleAction} className="space-y-4">
                { success === false && message && (
                    <Alert variant="destructive">
                        <AlertTriangle className="size-4"/>
                        <AlertTitle>Sign-in faled!</AlertTitle>
                        <AlertDescription>
                            <p>{message}</p>
                        </AlertDescription>
                    </Alert>
                )}
            
                <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input name="name" id="name"/>
                    {errors?.properties?.name && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.name.errors[0]}</p>
                    )}
                </div>
            
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" id="email"/>
                    {errors?.properties?.email && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.email.errors[0]}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" id="password"/>
                    {errors?.properties?.password && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.password.errors[0]}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm your Password</Label>
                    <Input name="confirmPassword" type="password" id="confirmPassword"/>
                    {errors?.properties?.confirmPassword && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.confirmPassword.errors[0]}</p>
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin"/> : "Create Account"}
                </Button>
                <Button variant="link" className="w-full"
                    render={<Link href="/auth/sign-in" className="text-xs font-medium text-foreground hover:underline" />}
                    nativeButton={false}
                >
                    Already registred? Sign in
                </Button>
            </form>

            <form action={signInWithGitHub}>
                <Button type="submit" variant="outline" className="w-full cursor-pointer">
                    <Image src={githubIcon} alt="GitHub" width={100} height={100} className="size-4 mr-2 dark:invert"/>
                    Sign up with GitHub
                </Button>
            </form>
        </div>
    )
}