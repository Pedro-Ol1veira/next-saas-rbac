import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    return (
        <form className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" id="email"/>
            </div>

            <Button type="submit" className="w-full">Recover password</Button>

            <Button variant="link" className="w-full"
                render={<Link href="/auth/sign-in" className="text-xs font-medium text-foreground hover:underline" />}
                nativeButton={false}
            >
                Back to Sign In
            </Button>

        </form>
    )
}