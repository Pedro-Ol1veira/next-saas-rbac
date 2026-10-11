'use client';

import { ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProjects } from "@/http/getProjects";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

export function ProjectSwitcher() {

    const { slug: orgSlug, project: projectSlug } = useParams<{
        slug: string;
        project: string;
    }>();

    const { data, isLoading } = useQuery({
        queryKey: [orgSlug, 'projects'],
        queryFn: () => getProjects(orgSlug),
        enabled: !!orgSlug,
    });

    const currentProject = data && projectSlug ? data?.projects.find((project) => project.slug === projectSlug) : null;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-42 items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {isLoading ? (
                    <>
                        <Skeleton className="size-4.5 shrink-0 rounded-full"/>
                        <Skeleton className="h-4 w-full"/>
                    </>
                ) : (
                    <>
                        {currentProject ? (
                            <>
                                <Avatar className="size-4.5">
                                    {currentProject.avatarUrl && <AvatarImage src={currentProject.avatarUrl} />}
                                    <AvatarFallback />
                                </Avatar>
                                <span className="truncate text-left">{currentProject.name}</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">Select project</span>
                        )}
                    </>
                )}
                
                {isLoading ? (
                    <Loader2 className="ml-auto size-4 text-muted-foreground animate-spin shrink-0"/>
                ) : (
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground shrink-0"/>
                )}
                
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                alignOffset={-16} 
                className="w-50"
                sideOffset={12}
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Projects</DropdownMenuLabel>
                    {data && data.projects.map((project) => (
                        <DropdownMenuItem 
                            key={project.id} 
                            className="cursor-pointer"
                            render={
                                <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                                    <Avatar className="mr-2 size-4">
                                        {project.avatarUrl && <AvatarImage src={project.avatarUrl} />}
                                        <AvatarFallback />
                                    </Avatar>
                                    <span className="line-clamp-1">{project.name}</span>
                                </Link>
                            }
                        />     
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    render={<Link href={`/org/${orgSlug}/create-project`}/>}                
                >
                    <PlusCircle className="mr-2 size-4" />
                    Create new
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}