'use server';

import { z } from "zod";
import { HTTPError } from "ky";
import { createProject } from "@/http/createProject";
import { getCurrentOrg } from "@/auth/auth";
// import { createProject } from "@/http/createProject";

const projectSchema = z.object({
    name: z.string().min(4, "Please include at least 4 characters in the project name"),
    description: z.string()
})

export async function createProjectAction(data: FormData) {

    const result = projectSchema.safeParse(Object.fromEntries(data));

    if(result.success === false) {

        const errors = z.treeifyError(result.error); 
        return {
            success: false,
            message: null,
            errors
        }
    }
    
    const { name, description } = result.data;

    try {
        await createProject({
            name,
            description,
            org: (await getCurrentOrg())!
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

    return { 
        success: true,
        message: "Successfully saved the project.",
        errors: null
    }

}