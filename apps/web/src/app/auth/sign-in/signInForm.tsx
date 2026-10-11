'use client';

import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import githubIcon from "@/../public/githubIcon.svg";
import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormState } from "@/hooks/useFormState";
import { signInWithGitHub } from "../actions";
import { useSearchParams } from "next/navigation";


export default function SignInForm() {

    // const [{ success, message, errors }, formAction, isPending ] = useActionState(signInWithEmailAndPassword, {
    //     success: false,
    //     message: null,
    //     errors: null
    // });
    const [{ success, message, errors }, handleAction, isPending] = useFormState(signInWithEmailAndPassword);
    const searchParams = useSearchParams();
    
    return(
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
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" type="email" id="email" defaultValue={searchParams.get('email') || ''} />
                    {errors?.properties?.email && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.email.errors[0]}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" id="password"/>
                    <Link href="/auth/forgot-password" className="text-xs font-medium text-foreground hover:underline">
                        Forgot Password?
                    </Link>
                    {errors?.properties?.password && (
                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.properties.password.errors[0]}</p>
                    )}
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin"/> : "Sign in with Email"}
                </Button>
                <Button variant="link" className="w-full"
                    render={<Link href="/auth/sign-up" className="text-xs font-medium text-foreground hover:underline" />}
                    nativeButton={false}
                >
                    Create new account
                </Button>
                <Separator />
            </form>

            <form action={signInWithGitHub}>
                <Button type="submit" variant="outline" className="w-full cursor-pointer">
                    <Image src={githubIcon} alt="GitHub" width={100} height={100} className="size-4 mr-2 dark:invert"/>
                    Sign in with GitHub
                </Button>
            </form>
        </div>
    )
}