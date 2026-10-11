'use server';

import { z } from "zod";
import { signInWithPassword } from "@/http/signInWithPassword";
import { HTTPError } from "ky";
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { signUp } from "@/http/signUp";

const signUpSchema = z.object({
    name: z.string().refine(value => value.split(' ').length > 1, "Please enter your full name"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password should have at least 6 characters"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export async function signUpAction(data: FormData) {

    const result = signUpSchema.safeParse(Object.fromEntries(data));

    if(result.success === false) {

        const errors = z.treeifyError(result.error); 
        return {
            success: false,
            message: null,
            errors
        }
    }
    
    const { email, password, name } = result.data;

    try {
        await signUp({
            email,
            password,
            name
        });

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

    redirect('/auth/sign-in');
}