import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { getOrganizations } from "@/http/getOrganizations";
import { getCurrentOrg } from "@/auth/auth";

export async function OrganizationSwitcher() {

    const currentOrg = await getCurrentOrg();
    const { organization } = await getOrganizations();

    const currentOrganization = organization.find((org) => org.slug === currentOrg);
    
    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-42 items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {currentOrganization ? (
                    <>
                        <Avatar className="size-4.5">
                            {currentOrganization.avatar_url && <AvatarImage src={currentOrganization.avatar_url} />}
                            <AvatarFallback />
                        </Avatar>
                        <span className="truncate text-left">{currentOrganization.name}</span>
                    </>
                ) : (
                    <span className="text-muted-foreground">Select organization</span>
                )}
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                alignOffset={-16} 
                className="w-50"
                sideOffset={12}
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                    {organization.map((org) => (
                        <DropdownMenuItem 
                            key={org.id} 
                            className="cursor-pointer"
                            render={
                                <Link href={`/org/${org.slug}`}>
                                    <Avatar className="mr-2 size-4">
                                        {org.avatar_url && <AvatarImage src={org.avatar_url} />}
                                        <AvatarFallback />
                                    </Avatar>
                                    <span className="line-clamp-1">{org.name}</span>
                                </Link>
                            }
                        />
                            
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    render={<Link href="/create-organization"/>}                
                >
                    <PlusCircle className="mr-2 size-4" />
                    Create new
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}