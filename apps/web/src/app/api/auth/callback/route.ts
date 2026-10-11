import { acceptInvite } from "@/http/acceptInvite";
import { signInWithGithub } from "@/http/signInWithGithub";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParms = request.nextUrl.searchParams;
    const code = searchParms.get('code');

    if(!code) return NextResponse.json({ message: "Github OAuth code was not found" }, { status: 400 });

    const { token } = await signInWithGithub({ code });

    const cookieStorage = await cookies();
    
    cookieStorage.set('token', token, { 
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    const inviteId = cookieStorage.get('inviteId')?.value;
    if(inviteId) {
        try {
            await acceptInvite(inviteId)
            cookieStorage.delete('inviteId');
        } catch {}
    }
    
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '';
    
    return NextResponse.redirect(redirectUrl);
}