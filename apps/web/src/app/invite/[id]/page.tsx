import { auth, isAuthenticated } from "@/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { acceptInvite } from "@/http/acceptInvite";
import { getInvite } from "@/http/getInvite";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CheckCircle, LogIn, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

dayjs.extend(relativeTime);

interface InvitePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
    const { id } = await params;

    const { invite } = await getInvite(id);
    const isUserAuthenticated = await isAuthenticated();
    let currentUserEmail;

    if(isUserAuthenticated) {
       const { user } = (await auth());
       currentUserEmail = user.email;
    }
    const userIsAuthenticatedWithSameEmailFromInvite = currentUserEmail === invite.email;

    async function signInFormInvite() {
        "use server";

        const cookieStorate = await cookies();
        cookieStorate.set("inviteId", id);

        redirect(`/auth/sign-in?email=${invite.email}`);
    }

    async function acceptInviteAction() {
        "use server";

        await acceptInvite(id);

        redirect(`/`);
    }
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6 flex flex-col justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="size-16">
                        {invite.author?.avatarUrl && (
                            <AvatarImage src={invite.author.avatarUrl} />
                        )}
                        <AvatarFallback />
                    </Avatar>

                    <p className="text-center leading-relaxed text-muted-foreground text-balance">
                        <span className="font-medium text-foreground">{invite.author?.name || 'Someone'}</span>{' '}
                        invited you to join <span className="font-medium text-foreground">{invite.organization.name}</span>.{' '} 
                        <span className="text-xs">{dayjs(invite.createdAt).fromNow()}</span>
                    </p>
                </div>

                <Separator />

                {!isUserAuthenticated && (
                    <form action={signInFormInvite}>
                        <Button type="submit" variant="secondary" className="w-full">
                            <LogIn className="size-4 mr-2" />
                            Sign in to accept
                        </Button>
                    </form>
                )}

                {userIsAuthenticatedWithSameEmailFromInvite && (
                    <form action={acceptInviteAction}>
                        <Button type="submit" variant="secondary" className="w-full">
                            <CheckCircle className="size-4 mr-2" />
                            Joing {invite.organization.name}
                        </Button>
                    </form>
                )}

                {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
                    <div className="space-y-4">
                        <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
                            This invite was sent to <span className="font-medium text-foreground">{invite.email}</span>, but you are authenticated as <span className="font-medium text-foreground">{currentUserEmail}</span>.
                        </p>
                        <div className="space-y-2">
                            <Button className="w-full" variant="secondary"
                                render={<a href="/api/auth/sign-out"/>}
                            >
                                <LogOut className="size-4 mr-2" />
                                Sign out from {currentUserEmail}
                            </Button>
                            <Button className="w-full" variant="outline"
                                render={<Link href="/"/>}
                            >
                                Back to dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}