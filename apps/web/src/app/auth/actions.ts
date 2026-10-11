'use server';

import { env } from "@saas/env";
import { redirect } from "next/navigation";

export async function signInWithGitHub() {
    const gitgubSignInUrl = new URL('login/oauth/authorize', 'https://github.com');

    gitgubSignInUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
    gitgubSignInUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI);
    gitgubSignInUrl.searchParams.set('scope', 'user');

    redirect(gitgubSignInUrl.toString());
}