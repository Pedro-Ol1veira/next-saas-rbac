import { getMembership } from '@/http/getMembership';
import { getProfile } from '@/http/getProfile';
import { defineAbilityFor } from '@saas/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function isAuthenticated() {
    const cookieStorage = await cookies();
    
    return !!cookieStorage.get('token')?.value;
}

export async function getCurrentOrg() {
    const cookieStorage = await cookies();
    const currentOrg = cookieStorage.get('org')?.value ?? null;

    return currentOrg;
}

export async function getCurrentMembership() {
    const org = await getCurrentOrg();
    if(!org) return null;
    
    const { membership } = await getMembership(org);
    return membership;
}

export async function ability() {
    const membership = await getCurrentMembership();

    if(!membership) return null;

    const ability = defineAbilityFor({
        id: membership.userId,
        role: membership.role,
    });

    return ability;
}

export async function auth() {
    const cookieStorage = await cookies();
    const token = cookieStorage.get('token')?.value;

    if(!token) redirect('/auth/sign-in');

    try {
        const { user } = await getProfile();

        return { user }
    } catch (error) {
    }

    redirect('/api/auth/sign-out');
}