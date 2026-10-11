import { Button } from "./ui/button";
import { getCurrentOrg, ability } from "@/auth/auth";
import { NavLink } from "./nav-link";

export async function Tabs() {

    const currentOrg = await getCurrentOrg();
    const permissions = await ability();
    const canUptateOrg = permissions?.can("update", "Organization");
    const canGetBilling = permissions?.can("get", "Billing");
    const canGetMembers = permissions?.can("get", "User");
    const canGetProjects = permissions?.can("get", "Project");


    return (
        <div className="border-b py-4">
            <nav className="mx-auto flex max-w-300 items-center gap-2">
                { canGetProjects && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        nativeButton={false}
                        render={<NavLink href={`/org/${currentOrg}`}/>}
                        className="border border-transparent cursor-pointer text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
                    >
                        Projects
                    </Button>
                )}

                { canGetMembers && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        nativeButton={false}
                        render={<NavLink href={`/org/${currentOrg}/members`}/>}
                        className="border border-transparent cursor-pointer text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
                    >
                        Members
                    </Button>
                )}
                { (canUptateOrg || canGetBilling) && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        nativeButton={false}
                        render={<NavLink href={`/org/${currentOrg}/settings`}/>}
                        className="border border-transparent cursor-pointer text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-border"
                    >
                        Settings & Billing
                    </Button>
                )}
                
            </nav>
        </div>
    )
}