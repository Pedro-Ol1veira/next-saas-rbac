'use server';

import { z } from "zod";
import { signInWithPassword } from "@/http/signInWithPassword";
import { HTTPError } from "ky";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { acceptInvite } from "@/http/acceptInvite";

const signInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function signInWithEmailAndPassword(data: FormData) {

    const result = signInSchema.safeParse(Object.fromEntries(data));

    if(result.success === false) {

        const errors = z.treeifyError(result.error); 
        return {
            success: false,
            message: null,
            errors
        }
    }
    
    const { email, password } = result.data;

    try {
        const { token } = await signInWithPassword({
            email,
            password,
        });

        const cookieStorage = await cookies();

        cookieStorage.set('token', token, { 
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });
        const inviteId = cookieStorage.get('inviteId')?.value;
        if(inviteId) {
            try {
                console.log("accepting invite with id: ", inviteId);
                await acceptInvite(inviteId)
            } catch(err: any) {
                console.log(err);
            }
        }
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

    redirect('/');
}