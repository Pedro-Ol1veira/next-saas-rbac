'use server';

import { z } from "zod";
import { HTTPError } from "ky";
import { createOrganization } from "@/http/createOrganization";
import { getCurrentOrg } from "@/auth/auth";
import { updateOrganization } from "@/http/updateOrganization";
import { updateTag } from 'next/cache';

const organizationSchema = z.object({
    name: z.string().min(4, "Please include at least 4 characters in the organization name"),
    domain: z.string().nullable().refine(value => {
        if(value) {
            const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,11}?$/;
            return domainRegex.test(value);
        }

        return true;
    }, { message: "Please enter a valid domain name" }),
    shouldAttachUserByDomain: z.union([z.literal("on"), z.literal("off"), z.boolean()])
        .transform(value => value === "on" || value === true)
        .default(false)
}).refine((data) => {
    if(data.shouldAttachUserByDomain === true && !data.domain) {
        return false;
    }

    return true;
}, { message: "Please provide a domain name if you want to attach users by domain", path: ["domain"] });

export type OrganizationSchema = z.infer<typeof organizationSchema>;

export async function createOrganizationAction(data: FormData) {

    const result = organizationSchema.safeParse(Object.fromEntries(data));

    if(result.success === false) {

        const errors = z.treeifyError(result.error); 
        return {
            success: false,
            message: null,
            errors
        }
    }
    
    const { name, domain, shouldAttachUserByDomain } = result.data;

    try {
        await createOrganization({
            name,
            domain,
            shouldAttachUserByDomain
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
        message: "Successfully saved the organization.",
        errors: null
    }

}
export async function updateOrganizationAction(data: FormData) {
    const currentOrg = await getCurrentOrg();
    const result = organizationSchema.safeParse(Object.fromEntries(data));

    if(result.success === false) {

        const errors = z.treeifyError(result.error); 
        return {
            success: false,
            message: null,
            errors
        }
    }
    
    const { name, domain, shouldAttachUserByDomain } = result.data;

    try {
        await updateOrganization({
            name,
            domain,
            shouldAttachUserByDomain,
            org: currentOrg!
        });

        updateTag('organizations');
        
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
        message: "Successfully saved the organization.",
        errors: null
    }

}